namespace DocumentManager.Services;

using System;
using System.IO;
using System.Net;
using System.Net.Http.Headers;
using AutoMapper;
using DocumentManager.Models.Entities;
using DocumentManager.Repositories;
using DocumentManager.Helpers;
using DocumentManager.Models.DTO.Document.Response;
using DocumentManager.Models.DTO.Document.Request;
using DocumentManager.Models.DTO.Email.Request;
using DocumentManager.Models.DTO.Category.Response;
using DocumentManager.Models.DTO.CategoryDocument.Response;
using DocumentManager.Models.DTO.UserCategorySubscription.Response;
using DocumentManager.Models.DTO.User.Response;

public interface IDocumentService
{
    IEnumerable<DocumentResponse> GetAll(Guid? categoryId, string? title, string? description, bool? isValidated, Guid? authorId);
    DocumentResponse? GetById(Guid id = new Guid());
    Task<DocumentResponse?> CreateAsync(DocumentCreateRequest documentCreateRequest);
    DocumentResponse? UpdateById(Guid id, DocumentUpdateRequest documentUpdateRequest);
    DocumentResponse? ValidateById(Guid id, EmailRequest emailRequest);
    Task DeleteById(Guid id = new Guid());
}

/**
 * Alternative à l'enum string
*/
public static class EmailTemplateDelimiters
{
    public const string Prefix = "$$";
    public const string Suffix = "$$";
}

public static class EmailTemplateVariables
{
    public const string URL = "URL";
    public const string Title = "TITLE";
    public const string Description = "DESCRIPTION";
}

public class DocumentService : IDocumentService
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICategoryDocumentService _categoryDocumentService;
    private readonly IUserCategorySubscriptionService _userCategorySubscriptionService;
    private readonly IEmailService _emailService;
    private readonly IMapper _mapper;
    private readonly ILogger<DocumentService> _logger;
    private readonly IConfiguration _configuration;

    public DocumentService(IDocumentRepository documentRepository, IUserRepository userRepository, ICategoryDocumentService categoryDocumentService, IUserCategorySubscriptionService userCategorySubscriptionService, IEmailService emailService, IMapper mapper, ILogger<DocumentService> logger, IConfiguration configuration)
    {
        _documentRepository = documentRepository;
        _userRepository = userRepository;
        _categoryDocumentService = categoryDocumentService;
        _userCategorySubscriptionService = userCategorySubscriptionService;
        _emailService = emailService;
        _mapper = mapper;
        _logger = logger;
        _configuration = configuration;
    }

    public IEnumerable<DocumentResponse> GetAll(Guid? categoryId, string? title, string? description, bool? isValidated, Guid? authorId)
    {
        try
        {
            IEnumerable<DocumentEntity> documentEntities = _documentRepository.FindAll().ToList();
            if (categoryId.HasValue)
            {
                documentEntities = documentEntities.Where(d => d.Categories.Any(c => c.Id == categoryId));
            }
            if (!string.IsNullOrEmpty(title))
            {
                documentEntities = documentEntities.Where(d => d.Title != null && d.Title.Contains(title));
            }
            if (!string.IsNullOrEmpty(description))
            {
                documentEntities = documentEntities.Where(d => d.Description != null && d.Description.Contains(description));
            }
            if (isValidated.HasValue)
            {
                documentEntities = documentEntities.Where(d => d.IsValidated == isValidated);
            }
            if (authorId.HasValue)
            {
                documentEntities = documentEntities.Where(d => d.SenderUserId == authorId);
            }
            foreach (DocumentEntity documentEntity in documentEntities)
            {
                string filePath = documentEntity.FilePath ?? "";
                string documentBaseUrl = _configuration["DocumentBaseUrl"] ?? "https://localhost:443";
                string secureUrl = $"{documentBaseUrl}{filePath}";
                documentEntity.FileUrl = secureUrl;
            }
            _logger.LogInformation(LogEvents.ListItems, "[DocumentService][GetAll] - Documents récupérés avec succès.");
            return _mapper.Map<IEnumerable<DocumentResponse>>(documentEntities);
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[DocumentService][GetAll] - Une erreur s'est produite lors de la récupération des documents : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la récupération des documents.");
        }
    }

    public DocumentResponse? GetById(Guid id = new Guid())
    {
        try
        {
            DocumentEntity? documentEntity = _documentRepository.FindById(id)?.Result;
            if (documentEntity != null)
            {
                string filePath = documentEntity.FilePath ?? "";
                string documentBaseUrl = _configuration["DocumentBaseUrl"] ?? "https://localhost:443";
                string secureUrl = $"{documentBaseUrl}{filePath}";
                documentEntity.FileUrl = secureUrl;
            }
            _logger.LogInformation(LogEvents.GetItem, "[DocumentService][GetById] - Document récupéré avec succès (ID : {0}).", id);
            return _mapper.Map<DocumentResponse?>(documentEntity);
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.GetItemNotFound, "[DocumentService][GetById] - Une erreur s'est produite lors de la récupération du document (ID : {0}) : {1}", id, ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, $"Une erreur s'est produite lors de la récupération du document (ID : {id}).");
        }
    }

    public async Task<DocumentResponse?> CreateAsync(DocumentCreateRequest documentCreateRequest)
    {
        try
        {
            if (documentCreateRequest.File == null || documentCreateRequest.File.Length <= 0)
            {
                _logger.LogError(LogEvents.InvalidFormatItem, "[DocumentService][Create] - Le fichier n'a pas été correctement téléchargé.");
                throw new AppException((int)HttpStatusCode.BadRequest, "Le fichier n'a pas été correctement téléchargé.");
            }
            IFormFile? file = documentCreateRequest.File;
            if (file == null || file.Length <= 0)
            {
                _logger.LogError(LogEvents.InvalidFormatItem, "[DocumentService][Create] - Le fichier ne peut être vide.");
                throw new AppException((int)HttpStatusCode.BadRequest, "Le fichier ne peut être vide.");
            }
            string folderName = Path.Combine("Resources", "Documents");
            string pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            string? fileName = file.ContentDisposition != null
                ? ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName?.Trim('"')
                : null;
            if (string.IsNullOrEmpty(fileName))
            {
                _logger.LogError(LogEvents.InvalidFormatItem, "[DocumentService][Create] - Le nom du fichier est invalide.");
                throw new AppException((int)HttpStatusCode.BadRequest, "Le nom du fichier est invalide.");
            }
            if (!FileUtil.IsValidFileType(fileName))
            {
                string? supportedFileTypes = string.Join(", ", Enum.GetNames(typeof(AllowedFileTypes)));
                _logger.LogError(LogEvents.InvalidFormatItem, $"[DocumentService][Create] - Le type du fichier n'est pas pris en charge. Les types de fichiers pris en charge sont : {supportedFileTypes}");
                throw new AppException((int)HttpStatusCode.BadRequest, $"Le type du fichier n'est pas pris en charge. Les types de fichiers pris en charge sont : {supportedFileTypes}");
            }
            string extension = Path.GetExtension(fileName);
            string uniqueFileName = $"{Guid.NewGuid()}{extension}";
            string fullPath = Path.Combine(pathToSave, uniqueFileName);
            string dbPath = Path.Combine(folderName, uniqueFileName);
            using (FileStream stream = new FileStream(fullPath, FileMode.Create))
            {
                file.CopyTo(stream);
            }
            DocumentEntity? documentEntity = _mapper.Map<DocumentEntity>(documentCreateRequest);
            documentEntity.FilePath = Path.DirectorySeparatorChar + dbPath;
            UserEntity? senderUserEntity = null;
            if (Guid.TryParse(documentCreateRequest?.SenderUser?.Id, out var senderUserId))
            {
                senderUserEntity = _userRepository.FindByIdAsync(senderUserId)?.Result;
            }
            UserEntity? validatorUserEntity = null;
            if (Guid.TryParse(documentCreateRequest?.ValidatorUser?.Id, out var validatorUserId))
            {
                validatorUserEntity = _userRepository.FindByIdAsync(validatorUserId)?.Result;
            }
            documentEntity.SenderUser = senderUserEntity;
            documentEntity.SenderUserId = senderUserEntity?.Id ?? null;
            documentEntity.IsValidated = false;
            if (validatorUserEntity != null) {
                documentEntity.ValidatorUser = validatorUserEntity;
                documentEntity.ValidatorUserId = validatorUserEntity?.Id ?? null;
                documentEntity.ValidatedAt = DateTime.UtcNow;
                documentEntity.IsValidated = true;
            }
            documentEntity = await _documentRepository.Save(documentEntity);
            if (documentEntity == null)
            {
                _logger.LogError(LogEvents.InternalError, String.Format("[DocumentService][Create] - Une erreur s'est produite lors de l'enregistrement du document : {0}", fileName));
                throw new AppException(LogEvents.InternalError, String.Format("[DocumentService][Create] - Une erreur s'est produite lors de l'enregistrement du document : {0}", fileName));
            }
            _logger.LogInformation(LogEvents.InsertItem, "[DocumentService][Create] - Document créé avec succès.");
            // URL
            if (documentEntity != null)
            {
                string filePath = documentEntity?.FilePath ?? "";
                string documentBaseUrl = _configuration["DocumentBaseUrl"] ?? "https://localhost:443";
                string secureUrl = $"{documentBaseUrl}{filePath}";
                documentEntity.FileUrl = secureUrl;
            }
            return _mapper.Map<DocumentResponse>(documentEntity);
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[DocumentService][Create] - Une erreur s'est produite lors de la création du document : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, String.Format("Une erreur s'est produite lors de la création du document : {0}", ex.Message));
        }
    }

    public DocumentResponse? UpdateById(Guid id, DocumentUpdateRequest documentUpdateRequest)
    {
        try
        {
            if (documentUpdateRequest.File == null || documentUpdateRequest.File.Length <= 0)
            {
                _logger.LogError(LogEvents.InvalidFormatItem, "[DocumentService][Create] - Le fichier n'a pas été correctement téléchargé.");
                throw new AppException((int)HttpStatusCode.BadRequest, "Le fichier n'a pas été correctement téléchargé.");
            }
            IFormFile? file = documentUpdateRequest.File;
            if (file == null || file.Length <= 0)
            {
                _logger.LogError(LogEvents.InvalidFormatItem, "[DocumentService][Create] - Le fichier ne peut être vide.");
                throw new AppException((int)HttpStatusCode.BadRequest, "Le fichier ne peut être vide.");
            }
            DocumentEntity? existingDocument = _documentRepository.FindById(id)?.Result;
            if (existingDocument == null)
            {
                _logger.LogError(LogEvents.GetItemNotFound, "[DocumentService][Update] - Aucun document trouvé avec l'identifiant {0}.", id);
                throw new AppException((int)HttpStatusCode.NotFound, "Aucun document trouvé avec l'identifiant {0}.", id);
            }
            _mapper.Map(documentUpdateRequest, existingDocument);
            UserEntity? senderUserEntity = null;
            if (Guid.TryParse(documentUpdateRequest?.SenderUser?.Id, out var senderUserId))
            {
                senderUserEntity = _userRepository.FindByIdAsync(senderUserId)?.Result;
            }
            UserEntity? validatorUserEntity = null;
            if (Guid.TryParse(documentUpdateRequest?.ValidatorUser?.Id, out var validatorUserId))
            {
                validatorUserEntity = _userRepository.FindByIdAsync(validatorUserId)?.Result;
            }
            existingDocument.SenderUser = senderUserEntity;
            existingDocument.SenderUserId = senderUserEntity?.Id ?? null;
            existingDocument.IsValidated = false;
            if (validatorUserEntity != null)
            {
                existingDocument.ValidatorUser = validatorUserEntity;
                existingDocument.ValidatorUserId = validatorUserEntity?.Id ?? null;
                existingDocument.ValidatedAt = DateTime.UtcNow;
                existingDocument.IsValidated = true;
            }
            if (!string.IsNullOrEmpty(existingDocument.FilePath))
            {
                // Suppression de l'ancien fichier
                _logger.LogInformation(LogEvents.UpdateItem, "[DocumentService][Update] - Document mis à jour avec succès.");
                string fullPathToDeleteLocal = existingDocument.FilePath;
                // Dans le Docker, il y a une copie dans /app
                string fullPathToDeleteDocker = "/app" + existingDocument.FilePath;
                try
                {
                    if (File.Exists(fullPathToDeleteLocal))
                    {
                        File.Delete(fullPathToDeleteLocal);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(LogEvents.UpdateItem, String.Format("[DocumentService][Update] - Erreur lors de la suppression du fichier : {0}", ex.Message));
                }
                try
                {
                    if (File.Exists(fullPathToDeleteDocker))
                    {
                        File.Delete(fullPathToDeleteDocker);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(LogEvents.UpdateItem, String.Format("[DocumentService][Update] - Erreur lors de la suppression du fichier : {0}", ex.Message));
                }
            }
            string folderName = Path.Combine("Resources", "Documents");
            string pathToSave = Path.Combine(Directory.GetCurrentDirectory(), "Resources", "Documents");
            string? fileName = file.ContentDisposition != null
                ? ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName?.Trim('"')
                : null;
            if (string.IsNullOrEmpty(fileName))
            {
                _logger.LogError(LogEvents.InvalidFormatItem, "[DocumentService][Create] - Le nom du fichier est invalide.");
                throw new AppException((int)HttpStatusCode.BadRequest, "Le nom du fichier est invalide.");
            }
            if (!FileUtil.IsValidFileType(fileName))
            {
                string? supportedFileTypes = string.Join(", ", Enum.GetNames(typeof(AllowedFileTypes)));
                _logger.LogError(LogEvents.InvalidFormatItem, $"[DocumentService][Create] - Le type du fichier n'est pas pris en charge. Les types de fichiers pris en charge sont : {supportedFileTypes}");
                throw new AppException((int)HttpStatusCode.BadRequest, $"Le type du fichier n'est pas pris en charge. Les types de fichiers pris en charge sont : {supportedFileTypes}");
            }
            string extension = Path.GetExtension(fileName);
            string uniqueFileName = $"{Guid.NewGuid()}{extension}";
            string fullPath = Path.Combine(pathToSave, uniqueFileName);
            string dbPath = Path.Combine(folderName, uniqueFileName);
            // Enregistrement du fichier sur le disque
            using (FileStream stream = new FileStream(fullPath, FileMode.Create))
            {
                file.CopyTo(stream);
            }
            // Mis à jour du chemin du fichier
            existingDocument.FilePath = Path.DirectorySeparatorChar + dbPath;
            // Mis à jour
            existingDocument = _documentRepository.Update(existingDocument)?.Result;
            if (existingDocument == null)
            {
                _logger.LogError(LogEvents.InternalError, String.Format("[DocumentService][Create] - Une erreur s'est produite lors de l'enregistrement du document : {0}", id));
                throw new AppException(LogEvents.InternalError, String.Format("[DocumentService][Create] - Une erreur s'est produite lors de l'enregistrement du document : {0}", id));
            }
            string filePath = existingDocument.FilePath ?? "";
            string documentBaseUrl = _configuration["DocumentBaseUrl"] ?? "https://localhost:443";
            string secureUrl = $"{documentBaseUrl}{filePath}";
            existingDocument.FileUrl = secureUrl;
            _logger.LogInformation(LogEvents.UpdateItem, "[DocumentService][Update] - Document mis à jour avec succès.");
            return _mapper.Map<DocumentResponse>(existingDocument);
        }
        catch (AppException ex)
        {
            _logger.LogError(LogEvents.GetItemNotFound, "[DocumentService][Update] - Erreur lors de la mise à jour du document : {0}", ex.Message);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[DocumentService][Update] - Une erreur s'est produite lors de la mise à jour du document : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la mise à jour du document : {0}", ex.Message);
        }
    }

    public DocumentResponse? ValidateById(Guid id, EmailRequest emailRequest)
    {
        try
        {
            DocumentResponse? documentResponse = GetById(id);
            if (documentResponse == null)
            {
                _logger.LogError(LogEvents.GetItemNotFound, $"[DocumentService][ValidateById] - Le document {id} n'a pas été trouvé.");
                throw new AppException((int)HttpStatusCode.BadRequest, $"Aucun document trouvé avec l'identifiant {id}.");
            }
            DocumentUpdateRequest documentUpdateRequest = _mapper.Map<DocumentUpdateRequest>(documentResponse);
            documentResponse = null;
            DocumentEntity? existingDocument = _documentRepository.FindById(id)?.Result;
            if (existingDocument == null)
            {
                _logger.LogError(LogEvents.GetItemNotFound, "[DocumentService][Update] - Aucun document trouvé avec l'identifiant {0}.", id);
                throw new AppException((int)HttpStatusCode.NotFound, "Aucun document trouvé avec l'identifiant {0}.", id);
            }
            _mapper.Map(documentUpdateRequest, existingDocument);
            existingDocument.IsValidated = true;
            existingDocument = _documentRepository.Update(existingDocument)?.Result;
            if (existingDocument == null)
            {
                _logger.LogError(LogEvents.InternalError, String.Format("[DocumentService][Create] - Une erreur s'est produite lors de l'enregistrement du document : {0}", id));
                throw new AppException(LogEvents.InternalError, String.Format("[DocumentService][Create] - Une erreur s'est produite lors de l'enregistrement du document : {0}", id));
            }
            string filePath = existingDocument.FilePath ?? "";
            string documentBaseUrl = _configuration["DocumentBaseUrl"] ?? "https://localhost:443";
            string secureUrl = $"{documentBaseUrl}{filePath}";
            existingDocument.FileUrl = secureUrl;
            _logger.LogInformation(LogEvents.UpdateItem, "[DocumentService][Update] - Document mis à jour avec succès.");
            // Récupére des catégories du document
            IEnumerable<CategoryDocumentResponse> categoriesDocumentsResponses = _categoryDocumentService.GetAllByDocumentId(id);
            IEnumerable<BaseCategoryResponse?> categories = categoriesDocumentsResponses.Select(ucs => ucs.Category);
            // Récupèration des utilisateurs abonnés aux catégories
            List<UserCategorySubscriptionResponse> usersCategoriesSubscriptions = new List<UserCategorySubscriptionResponse>();
            foreach (BaseCategoryResponse? category in categories)
            {
                if (category != null)
                {
                    IEnumerable<UserCategorySubscriptionResponse> subscriptions = _userCategorySubscriptionService.GetAllByCategoryId(Guid.Parse(category.Id));
                    usersCategoriesSubscriptions.AddRange(subscriptions);
                }
            }
            // Envoie de l'email aux utilisateurs abonnés aux catégories
            IEnumerable<BaseUserResponse?> users = usersCategoriesSubscriptions.Select(ucs => ucs.User);
            foreach (BaseUserResponse? user in users)
            {
                if (user != null)
                {
                    try
                    {
                        string template = emailRequest.Template;
                        // Remplacement des variables dans le modèle de courriel
                        template = template.Replace($"{EmailTemplateDelimiters.Prefix}{EmailTemplateVariables.URL}{EmailTemplateDelimiters.Suffix}", documentResponse?.FileUrl ?? "");
                        template = template.Replace($"{EmailTemplateDelimiters.Prefix}{EmailTemplateVariables.Title}{EmailTemplateDelimiters.Suffix}", documentResponse?.Title ?? "");
                        template = template.Replace($"{EmailTemplateDelimiters.Prefix}{EmailTemplateVariables.Description}{EmailTemplateDelimiters.Suffix}", documentResponse?.Description ?? "");
                        _emailService.SendEmail(user?.Email ?? "", emailRequest.Subject, template);
                        _logger.LogInformation(LogEvents.InsertItem, $"[DocumentService][ValidateById] - L'e-mail a été envoyé avec succès à {user?.Email ?? ""}.");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"[DocumentService][ValidateById] - Une erreur s'est produite lors de l'envoi de l'e-mail à l'utilisateur {user.Email}.");
                        throw new AppException((int)HttpStatusCode.InternalServerError, $"Une erreur s'est produite lors de l'envoi de l'e-mail à l'utilisateur {user.Email}.");
                    }
                }
            }
            return _mapper.Map<DocumentResponse>(existingDocument);
        }
        catch (AppException ex)
        {
            _logger.LogError(LogEvents.InternalError, $"[DocumentService][ValidateById] - Une erreur s'est produite lors de la validation du document : {ex.Message}");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, $"[DocumentService][ValidateById] - Une erreur s'est produite : {ex.Message}");
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la validation du document et de la notification des abonnés.");
        }
    }

    public async Task DeleteById(Guid id = new Guid())
    {
        try
        {
            DocumentEntity? existingDocument = _documentRepository.FindById(id)?.Result;
            if (existingDocument == null)
            {
                _logger.LogError(LogEvents.GetItemNotFound, "[DocumentService][Update] - Aucun document trouvé avec l'identifiant {0}.", id);
                throw new AppException((int)HttpStatusCode.NotFound, "Aucun document trouvé avec l'identifiant {0}.", id);
            }
            await _documentRepository.DeleteById(id);
            _logger.LogInformation(LogEvents.DeleteItem, string.Format("[DocumentService][DeleteById] - Document {0} supprimé avec succès.", id));
        }
        catch (AppException ex)
        {
            _logger.LogError(LogEvents.GetItemNotFound, "[DocumentService][DeleteById] - Erreur lors de la suppression du document : {0}", ex.Message);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[DocumentService][DeleteById] - Une erreur s'est produite lors de la suppression du document : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la suppression du document.");
        }
    }

}
