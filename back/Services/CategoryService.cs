namespace DocumentManager.Services;

using AutoMapper;
using System.Net;
using DocumentManager.Models.Entities;
using DocumentManager.Helpers;
using DocumentManager.Models.DTO.Category;
using DocumentManager.Models.DTO.Category.Request;
using DocumentManager.Models.DTO.Category.Response;
using DocumentManager.Repositories;


public interface ICategoryService
{
    IEnumerable<CategoryResponse> GetAll();
    CategoryResponse? GetById(Guid id = new Guid());
    CategoryResponse? Create(CategoryCreateRequest categoryCreateRequest);
    CategoryResponse? UpdateById(Guid id, CategoryUpdateRequest categoryUpdateRequest);
    Task DeleteById(Guid id = new Guid());
}

/**
 * pas de await async à la chaine comme sur les repo car c la méthode du dessus qui apelle direct
*/

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<CategoryService> _logger;

    public CategoryService(ICategoryRepository categoryRepository, IMapper mapper, ILogger<CategoryService> logger)
    {
        _categoryRepository = categoryRepository;
        _mapper = mapper;
        _logger = logger;
    }

    /// <summary>
    /// Filtre une liste de catégories pour inclure uniquement celles qui ne sont pas des feuilles
    /// et qui ne sont pas déjà présentes dans les sous-catégories d'autres catégories.
    /// </summary>
    /// <param name="categories">La liste des catégories à filtrer.</param>
    /// <returns>Une nouvelle liste de catégories filtrées.</returns>
    public IEnumerable<CategoryEntity> FilterCategories(IEnumerable<CategoryEntity> categories)
    {
        List<CategoryEntity> categoriesToAdd = new List<CategoryEntity>();
        foreach (var category in categories)
        {
            bool shouldAdd = true;
            foreach (var tmpCategory in categories)
            {
                // Vérifie si l'ID de la catégorie actuelle est présent dans les sous-catégories de categoryTemp
                if (!category.Subcategories.Any() && tmpCategory.Subcategories.Any(sub => sub.Id == category.Id))
                {
                    shouldAdd = false;
                    break;
                }
            }
            if (shouldAdd)
            {
                categoriesToAdd.Add(category);
            }
        }
        return categoriesToAdd;
    }

    public IEnumerable<CategoryResponse> GetAll()
    {
        try
        {
            IEnumerable<CategoryEntity> categoriesEntities = FilterCategories(_categoryRepository.FindAll().ToList());
            IEnumerable<CategoryResponse> categoryResponses = _mapper.Map<IEnumerable<CategoryResponse>>(categoriesEntities);
            _logger.LogInformation(LogEvents.ListItems, "[CategoryService][GetAll] - Liste des catégories récupérée avec succès.");
            return categoryResponses;
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[CategoryService][GetAll] - Une erreur s'est produite lors de la récupération de la liste des catégories : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la récupération de la liste des catégories.");
        }
    }

    public CategoryResponse? GetById(Guid id = new Guid())
    {
        try
        {
            CategoryEntity? categoryEntity = _categoryRepository.FindById(id)?.Result;
            if (categoryEntity == null)
            {
                _logger.LogError(LogEvents.GetItemNotFound, "[CategoryService][GetById] - Aucune catégorie trouvée avec l'identifiant {0}.", id);
                throw new AppException((int)HttpStatusCode.NotFound, $"Aucune catégorie trouvée avec l'identifiant {id}.");
            }
            _logger.LogInformation(LogEvents.GetItem, "[CategoryService][GetById] - Catégorie récupérée avec succès.");
            CategoryResponse categoryResponse = _mapper.Map<CategoryResponse>(categoryEntity);
            return categoryResponse;
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[CategoryService][GetById] - Une erreur s'est produite lors de la récupération de la catégorie : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la récupération de la catégorie.");
        }
    }

    public CategoryResponse? Create(CategoryCreateRequest categoryCreateRequest)
    {
        try
        {
            if (_categoryRepository.FindAll().Any(x => x.Name == categoryCreateRequest.Name))
            {
                _logger.LogError(LogEvents.GetItemAlreadyExists, "[CategoryService][Create] - La catégorie avec le nom '{0}' existe déjà.", categoryCreateRequest.Name);
                throw new AppException((int)HttpStatusCode.Conflict, String.Format("La catégorie avec le nom '{0}' existe déjà.", categoryCreateRequest.Name));
            }
            if (categoryCreateRequest.ParentCategoryId.HasValue && !_categoryRepository.FindAll().Any(x => x.Id == categoryCreateRequest.ParentCategoryId))
            {
                _logger.LogError(LogEvents.GetItemNotFound, "[CategoryService][Create] - La catégorie avec l'identifiant de la catégorie parente '{0}' n'existe pas.", categoryCreateRequest.ParentCategoryId);
                throw new AppException((int)HttpStatusCode.NotFound, $"La catégorie avec l'identifiant de la catégorie parente '{categoryCreateRequest.ParentCategoryId}' n'existe pas.");
            }
            CategoryEntity? categoryEntity = _mapper.Map<CategoryEntity?>(categoryCreateRequest);
            categoryEntity = _categoryRepository.Save(categoryEntity)?.Result;
            if (categoryEntity == null)
            {
                _logger.LogError(LogEvents.InternalError, String.Format("[CategoryService][Create] - Une erreur s'est produite lors de l'enregistrement de la catégorie : {0}", categoryCreateRequest?.Name ?? ""));
                throw new AppException(LogEvents.InternalError, String.Format("[CategoryService][Create] - Une erreur s'est produite lors de l'enregistrement de la catégorie : {0}", categoryCreateRequest?.Name ?? ""));
            }
            _logger.LogInformation(LogEvents.InsertItem, "[CategoryService][Create] - Catégorie créée avec succès.");
            return _mapper.Map<CategoryResponse?>(categoryEntity);
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[CategoryService][Create] - Une erreur s'est produite lors de la création de la catégorie : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la création de la catégorie.");
        }
    }

    public CategoryResponse? UpdateById(Guid id, CategoryUpdateRequest categoryUpdateRequest)
    {
        try
        {
            CategoryEntity? categoryEntity = _categoryRepository.FindById(id)?.Result;
            if (categoryEntity == null || categoryUpdateRequest.Name == null)
            {
                _logger.LogError(LogEvents.GetItemNotFound, "[CategoryService][UpdateById] - Aucune catégorie trouvé avec l'identifiant {0}", id);
                throw new AppException((int)HttpStatusCode.NotFound, String.Format("Aucune catégorie trouvé avec l'identifiant {0}", id));
            }
            if (categoryUpdateRequest.ParentCategoryId.HasValue && HasCyclicReference(id, categoryUpdateRequest.ParentCategoryId.Value))
            {
                _logger.LogError(LogEvents.InvalidFormatItem, "[CategoryService][UpdateById] - La mise à jour crée une référence cyclique dans la hiérarchie des catégories.");
                throw new AppException((int)HttpStatusCode.InternalServerError, "La mise à jour crée une référence cyclique dans la hiérarchie des catégories.");
            }
            _mapper.Map(categoryUpdateRequest, categoryEntity);
            categoryEntity = _categoryRepository.Update(categoryEntity)?.Result;
            if (categoryEntity == null)
            {
                _logger.LogError(LogEvents.InternalError, String.Format("[CategoryService][UpdateById] - Une erreur s'est produite lors de l'enregistrement de la catégorie : {0}", categoryUpdateRequest?.Name ?? ""));
                throw new AppException(LogEvents.InternalError, String.Format("[CategoryService][UpdateById] - Une erreur s'est produite lors de l'enregistrement de la catégorie : {0}", categoryUpdateRequest?.Name ?? ""));
            }
            _logger.LogInformation(LogEvents.UpdateItem, "[CategoryService][UpdateById] - Catégorie mise à jour avec succès.");
            return _mapper.Map<CategoryResponse?>(categoryEntity);
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[CategoryService][UpdateById] - Une erreur s'est produite lors de la mise à jour de la catégorie : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la mise à jour de la catégorie.");
        }
    }

    private bool HasCyclicReference(Guid categoryIdToUpdate, Guid newParentCategoryId)
    {
        if (categoryIdToUpdate == newParentCategoryId) return true;
        CategoryEntity? newParentCategory = _categoryRepository.FindById(newParentCategoryId)?.Result;
        // Vérification d'une référence cyclique en parcourant la hiérarchie parentale
        while (newParentCategory != null)
        {
            if (newParentCategory.Id == categoryIdToUpdate)
            {
                return true;
            }
            newParentCategory = _categoryRepository.FindById(newParentCategory.ParentCategoryId ?? Guid.Empty)?.Result;
        }
        return false;
    }

    public async Task DeleteById(Guid id)
    {
        try
        {
            CategoryEntity? categoryEntity = await _categoryRepository.FindById(id);
            if (categoryEntity == null)
            {
                _logger.LogError(LogEvents.GetItemNotFound, "[CategoryService][DeleteById] - Aucune catégorie trouvé avec l'identifiant {0}", id);
                throw new AppException((int)HttpStatusCode.NotFound, $"Aucune catégorie trouvé avec l'identifiant {id}");
            }
            await DeleteSubcategories(categoryEntity);
            await _categoryRepository.DeleteById(id);
            _logger.LogInformation(LogEvents.DeleteItem, "[CategoryService][DeleteById] - Catégorie supprimée avec succès.");
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[CategoryService][DeleteById] - Une erreur s'est produite lors de la suppression de la catégorie : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la suppression de la catégorie.");
        }
    }

    private async Task DeleteSubcategories(CategoryEntity? category)
    {
        if (category == null) return;
        foreach (CategoryEntity subcategory in category.Subcategories.ToList())
        {
            await DeleteSubcategories(subcategory);
            await _categoryRepository.DeleteById(subcategory.Id);
        }
    }

}
