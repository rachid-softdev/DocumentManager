namespace DocumentManager.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DocumentManager.Models.DTO.CategoryDocument.Request;
using DocumentManager.Models.DTO.CategoryDocument.Response;
using DocumentManager.Models.DTO.Category.Response;
using DocumentManager.Models.DTO.Document.Response;
using DocumentManager.Services;
using DocumentManager.Helpers;
using DocumentManager.Helpers.Authorization;

[ApiController]
[Route("/api/document_manager/categories-documents")]
public class CategoryDocumentController : Controller
{
    private readonly ICategoryDocumentService _categoryDocumentService;
    private readonly ILogger<CategoryDocumentController> _logger;


    public CategoryDocumentController(ICategoryDocumentService categoryDocumentService, ILogger<CategoryDocumentController> logger)
    {
        _categoryDocumentService = categoryDocumentService;
        _logger = logger;
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpGet]
    public ActionResult<IEnumerable<CategoryDocumentResponse>> GetAll()
    {
        IEnumerable<CategoryDocumentResponse> categoriesDocuments = _categoryDocumentService.GetAll();
        _logger.LogInformation(LogEvents.ListItems, "[CategoryDocumentController][GetAll] - CategoryDocument récupérés avec succès.");
        return Ok(categoriesDocuments);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpGet("{categoryId}")]
    public ActionResult<IEnumerable<CategoryDocumentResponse>> GetAllByCategoryId(Guid categoryId = new Guid())
    {
        IEnumerable<CategoryDocumentResponse> categoriesDocuments = _categoryDocumentService.GetAll();
        _logger.LogInformation(LogEvents.ListItems, string.Format("[CategoryDocumentController][GetAllByCategoryId] - CategoryDocument par categoryId {0} récupérés avec succès.", categoryId));
        return Ok(categoriesDocuments);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpGet("{documentId}")]
    public ActionResult<IEnumerable<CategoryDocumentResponse>> GetAllByDocumentId(Guid documentId = new Guid())
    {
        IEnumerable<CategoryDocumentResponse> categoriesDocuments = _categoryDocumentService.GetAll();
        _logger.LogInformation(LogEvents.ListItems, string.Format("[CategoryDocumentController][GetAllByDocumentId] - CategoryDocument par documentId {0} récupérés avec succès.", documentId));
        return Ok(categoriesDocuments);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpGet("{categoryId}/{documentId}")]
    public ActionResult<CategoryDocumentResponse> GetByIds(Guid categoryId = new Guid(), Guid documentId = new Guid())
    {
        CategoryDocumentResponse? categoryDocument = _categoryDocumentService.GetByIds(categoryId, documentId);
        if (categoryDocument == null)
        {
            _logger.LogInformation(LogEvents.GetItemNotFound, string.Format("[CategoryDocumentController][GetByIds] - La CategoryDocument avec categoryId={0} et documentId={1} ont été récupérés avec succès.", categoryId, documentId));
            return NotFound(String.Format("Aucune catégorie-document trouvé avec l'identifiant de la catégorie {0} et de document {1}", categoryId, documentId));
        }
        _logger.LogInformation(LogEvents.InsertItem, string.Format("[CategoryDocumentController][Create] - La CategoryDocument categoryId={0} et documentId={1} a été récupéré avec succès.", categoryId, documentId));
        return Ok(categoryDocument);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpGet("{documentId}/categories")]
    public ActionResult<IEnumerable<BaseCategoryResponse>> GetAllCategoriesByDocumentId(Guid documentId = new Guid())
    {
        IEnumerable<CategoryDocumentResponse> categoriesDocumentsResponses = _categoryDocumentService.GetAllByDocumentId(documentId);
        IEnumerable<BaseCategoryResponse?> categories = categoriesDocumentsResponses.Select(ucs => ucs.Category);
        _logger.LogInformation(LogEvents.ListItems, string.Format("[CategoryDocumentController][GetAllCategoriesByDocumentId] - Les catégories du document {0} ont été récupérés avec succès.", documentId));
        return Ok(categories);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpGet("{categoryId}/documents")]
    public ActionResult<IEnumerable<BaseDocumentResponse>> GetAllDocumentsByCategoryId(Guid categoryId = new Guid())
    {
        IEnumerable<CategoryDocumentResponse> categoriesDocumentsResponses = _categoryDocumentService.GetAllByCategoryId(categoryId);
        IEnumerable<BaseDocumentResponse?> documents = categoriesDocumentsResponses.Select(ucs => ucs.Document);
        _logger.LogInformation(LogEvents.ListItems, string.Format("[CategoryDocumentController][GetAllDocumentsByCategoryId] - Les documents de la catégorie {0} ont été récupérés avec succès.", categoryId));
        return Ok(documents);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpPost]
    public ActionResult<CategoryDocumentResponse> Create([FromBody] CategoryDocumentCreateRequest categoryDocumentCreateRequest)
    {
        if (!ModelState.IsValid)
        {
            List<string> errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
            _logger.LogError(LogEvents.InvalidFormatItem, "[CategoryController][Create] - La requête est incorrecte lors de la création d'un CategoryDocument  : {Errors}", errors);
            return this.BadRequest(ModelState);
        }
        CategoryDocumentResponse? categoryDocumentResponse = _categoryDocumentService.Create(categoryDocumentCreateRequest);
        _logger.LogInformation(LogEvents.InsertItem, string.Format("[CategoryDocumentController][Create] - La CategoryDocument categoryId={0} et documentId={1} a été crée avec succès.", categoryDocumentResponse?.Category?.Id ?? "", categoryDocumentResponse?.Document?.Id ?? ""));
        return Created("URI", categoryDocumentResponse);
    }

    [RoleAuthorizeAttribute(Role.Administrator)]
    [HttpDelete("{categoryId}/{documentId}")]
    public IActionResult DeleteByIds(Guid categoryId = new Guid(), Guid documentId = new Guid())
    {
        CategoryDocumentResponse? categoryDocumentResponse = _categoryDocumentService.GetByIds(categoryId, documentId);
        if (categoryDocumentResponse == null)
        {
            _logger.LogInformation(LogEvents.InvalidFormatItem, string.Format("[CategoryDocumentController][DeleteByIds] - La CategoryDocument avec categoryId={0} et documentId={1} a été récupéré avec succès.", categoryId, documentId));
            return NotFound(String.Format("Aucune catégorie-document trouvé avec l'identifiant de la catégorie {0} et document {1}", categoryId, documentId));
        }
        _logger.LogInformation(LogEvents.DeleteItem, string.Format("[CategoryDocumentController][DeleteByIds] - La CategoryDocument avec categoryId={0} et documentId={1} a été supprimé avec succès.", categoryId, documentId));
        _categoryDocumentService.DeleteByIds(categoryId, documentId);
        return Ok(new { message = String.Format("La liaison de la catégorie {0} avec le document {1} a été supprimée", categoryId, documentId) });
    }
}
