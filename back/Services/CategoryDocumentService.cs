namespace DocumentManager.Services;

using AutoMapper;
using System.Net;
using DocumentManager.Models.Entities;
using DocumentManager.Helpers;
using DocumentManager.Models.DTO.CategoryDocument.Request;
using DocumentManager.Models.DTO.CategoryDocument.Response;
using DocumentManager.Repositories;


public interface ICategoryDocumentService
{
	IEnumerable<CategoryDocumentResponse> GetAll();
	IEnumerable<CategoryDocumentResponse> GetAllByCategoryId(Guid categoryId = new Guid());
	IEnumerable<CategoryDocumentResponse> GetAllByDocumentId(Guid documentId = new Guid());
	CategoryDocumentResponse? GetByIds(Guid categoryId = new Guid(), Guid documentId = new Guid());
	CategoryDocumentResponse? Create(CategoryDocumentCreateRequest categoryDocumentCreateRequest);
	Task DeleteByIds(Guid categoryId = new Guid(), Guid documentId = new Guid());
}

/**
 * pas de await async à la chaine comme sur les repo car c la méthode du dessus qui apelle direct
*/
public class CategoryDocumentService : ICategoryDocumentService
{
	private readonly ICategoryDocumentRepository _categoryDocumentRepository;
	private readonly ICategoryRepository _categoryRepository;
	private readonly IDocumentRepository _documentRepository;
	private readonly IMapper _mapper;
	private readonly ILogger<CategoryDocumentService> _logger;

	public CategoryDocumentService(
		ICategoryDocumentRepository categoryDocumentRepository,
		ICategoryRepository categoryRepository,
		IDocumentRepository documentRepository,
		IMapper mapper,
		ILogger<CategoryDocumentService> logger
	)
	{
		_categoryDocumentRepository = categoryDocumentRepository;
		_categoryRepository = categoryRepository;
		_documentRepository = documentRepository;
		_mapper = mapper;
		_logger = logger;
	}

	public IEnumerable<CategoryDocumentResponse> GetAll()
	{
		try
		{
			IEnumerable<CategoryDocumentEntity> categoriesDocumentsEntities = _categoryDocumentRepository.FindAll().ToList();
			IEnumerable<CategoryDocumentResponse> categoryDocumentResponses = _mapper.Map<IEnumerable<CategoryDocumentResponse>>(categoriesDocumentsEntities);
			_logger.LogInformation(LogEvents.ListItems, "[CategoryDocumentService][GetAll] - Liste des catégories de documents récupérée avec succès.");
			return categoryDocumentResponses;
		}
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
		{
			_logger.LogError(LogEvents.InternalError, "[CategoryDocumentService][GetAll] - Une erreur s'est produite lors de la récupération des catégories de documents : {0}", ex.Message);
			throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la récupération des catégories de documents.");
		}
	}

	public IEnumerable<CategoryDocumentResponse> GetAllByCategoryId(Guid categoryId = new Guid())
	{
		try
		{
			IEnumerable<CategoryDocumentEntity> categoriesDocumentsEntities = _categoryDocumentRepository.FindAllByCategoryId(categoryId).ToList();
			IEnumerable<CategoryDocumentResponse> categoryDocumentResponses = _mapper.Map<IEnumerable<CategoryDocumentResponse>>(categoriesDocumentsEntities);
			_logger.LogInformation(LogEvents.ListItems, "[CategoryDocumentService][GetAllByCategoryId] - Liste des catégories de documents par ID de catégorie récupérée avec succès.");
			return categoryDocumentResponses;
		}
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
		{
			_logger.LogError(LogEvents.InternalError, "[CategoryDocumentService][GetAllByCategoryId] - Une erreur s'est produite lors de la récupération des catégories de documents par ID de catégorie : {0}", ex.Message);
			throw new AppException((int) HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la récupération des catégories de documents par ID de catégorie.");
		}
	}

	public IEnumerable<CategoryDocumentResponse> GetAllByDocumentId(Guid documentId = new Guid())
	{
		try
		{
			IEnumerable<CategoryDocumentEntity> categoriesDocumentsEntities = _categoryDocumentRepository.FindAllByDocumentId(documentId).ToList();
			IEnumerable<CategoryDocumentResponse> categoryDocumentResponses = _mapper.Map<IEnumerable<CategoryDocumentResponse>>(categoriesDocumentsEntities);
			_logger.LogInformation(LogEvents.ListItems, "[CategoryDocumentService][GetAllByDocumentId] - Liste des catégories de documents par ID de document récupérée avec succès.");
			return categoryDocumentResponses;
		}
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
		{
			_logger.LogError(LogEvents.InternalError, "[CategoryDocumentService][GetAllByDocumentId] - Une erreur s'est produite lors de la récupération des catégories de documents par ID de document : {0}", ex.Message);
			throw new AppException((int) HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la récupération des catégories de documents par ID de document.");
		}
	}

	public CategoryDocumentResponse? GetByIds(Guid categoryId = new Guid(), Guid documentId = new Guid())
	{
        try
        {
            CategoryDocumentEntity? categoryDocumentEntity = _categoryDocumentRepository.FindByIdsAsync(categoryId, documentId)?.Result;
            if (categoryDocumentEntity == null)
            {
                _logger.LogInformation(LogEvents.GetItemNotFound, "[CategoryDocumentService][GetByIds] - Aucun enregistrement trouvé pour les IDs spécifiés.");
                throw new AppException((int)HttpStatusCode.NotFound, "Aucun enregistrement trouvé pour les IDs spécifiés.");
            }
            CategoryDocumentResponse categoryDocumentResponse = _mapper.Map<CategoryDocumentResponse>(categoryDocumentEntity);
            _logger.LogInformation(LogEvents.GetItem, "[CategoryDocumentService][GetByIds] - Catégorie de document récupérée avec succès pour les IDs spécifiés.");
            return categoryDocumentResponse;
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[CategoryDocumentService][GetByIds] - Une erreur s'est produite lors de la récupération de la catégorie de document pour les IDs spécifiés : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la récupération de la catégorie de document pour les IDs spécifiés.");
        }
    }

	public CategoryDocumentResponse? Create(CategoryDocumentCreateRequest categoryDocumentCreateRequest)
	{
        try
        {
            string? categoryId = categoryDocumentCreateRequest.Category?.Id ?? Guid.Empty.ToString();
            string? documentId = categoryDocumentCreateRequest.Document?.Id ?? Guid.Empty.ToString();
            if (categoryId == null)
            {
                _logger.LogError(LogEvents.InvalidFormatItem, "[CategoryDocumentService][Create] - L'ID de catégorie spécifié est invalide.");
                throw new AppException((int) HttpStatusCode.NotFound, "La catégorie spécifiée n'existe pas.");
            }
            if (documentId == null)
            {
                _logger.LogError(LogEvents.InvalidFormatItem, "[CategoryDocumentService][Create] - L'ID de document spécifié est invalide.");
                throw new AppException((int) HttpStatusCode.NotFound, "Le document spécifié n'existe pas.");
            }
            CategoryEntity? categoryEntity = null;
            DocumentEntity? documentEntity = null;
            if (Guid.TryParse(categoryId, out Guid categoryGuid))
            {
                categoryEntity = _categoryRepository.FindById(categoryGuid)?.Result;
            }
            if (Guid.TryParse(documentId, out Guid documentGuid))
            {
                documentEntity = _documentRepository.FindById(documentGuid)?.Result;
            }
            if (categoryEntity == null)
            {
                _logger.LogError(LogEvents.GetItemNotFound, "[CategoryDocumentService][Create] - La catégorie avec l'ID {0} n'existe pas.", categoryId);
                throw new AppException((int) HttpStatusCode.NotFound, $"La catégorie {categoryId} spécifiée n'existe pas.");
            }
            if (documentEntity == null)
            {
                _logger.LogError(LogEvents.GetItemNotFound, "[CategoryDocumentService][Create] - Le document avec l'ID {0} n'existe pas.", documentId);
                throw new AppException((int) HttpStatusCode.NotFound, $"Le document {documentId} spécifié n'existe pas.");
            }
            bool doesExistCategoryDocument = false;
            try {
                doesExistCategoryDocument = this.GetByIds(categoryEntity.Id, documentEntity.Id) != null;
            } catch (AppException) {
                doesExistCategoryDocument = false;
            }
            if (doesExistCategoryDocument)
            {
                _logger.LogError(LogEvents.GetItemAlreadyExists, "[CategoryDocumentService][Create] - La liaison de la catégorie {0} avec le document {1} existe déjà.", categoryId, documentId);
                throw new AppException((int) HttpStatusCode.Conflict, $"La liaison de la catégorie {categoryId} avec le document {documentId} existe déjà.");
            }
            CategoryDocumentEntity? categoryDocumentEntity = new CategoryDocumentEntity
            {
                CategoryId = categoryEntity.Id,
                DocumentId = documentEntity.Id
            };
            categoryDocumentEntity = _categoryDocumentRepository.SaveAsync(categoryDocumentEntity)?.Result;
            _logger.LogInformation(LogEvents.InsertItem, "[CategoryDocumentService][Create] - Catégorie de document créée avec succès.");
            return _mapper.Map<CategoryDocumentResponse?>(categoryDocumentEntity);
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[CategoryDocumentService][Create] - Une erreur s'est produite lors de la création de la catégorie de document : {0}", ex.Message);
            throw new AppException((int) HttpStatusCode.InternalServerError, String.Format("Une erreur s'est produite lors de la création de la catégorie de document : {0}", ex.Message));
        }
    }

	public Task DeleteByIds(Guid categoryId = new Guid(), Guid documentId = new Guid())
	{
		try
		{
			CategoryDocumentEntity? categoryDocumentEntity = _categoryDocumentRepository.FindByIdsAsync(categoryId, documentId)?.Result;
			if (categoryDocumentEntity == null)
			{
				_logger.LogError(LogEvents.GetItemNotFound, "[CategoryDocumentService][DeleteByIds] - Aucune catégorie-document trouvé avec l'identifiant de la catégorie {0} et de document {1}.", categoryId, documentId);
				throw new AppException((int) HttpStatusCode.NotFound, $"Aucune catégorie-document trouvé avec l'identifiant de la catégorie {categoryId} et de document {documentId}.");
			}
			_logger.LogInformation(LogEvents.DeleteItem, "[CategoryDocumentService][DeleteByIds] - Catégorie-document supprimée avec succès.");
			return _categoryDocumentRepository.DeleteByIdsAsync(categoryId, documentId);
		}
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
		{
			_logger.LogError(LogEvents.InternalError, "[CategoryDocumentService][DeleteByIds] - Une erreur s'est produite lors de la suppression de la catégorie-document : {0}", ex.Message);
			throw new AppException((int) HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la suppression de la catégorie-document.");
		}
	}

}
