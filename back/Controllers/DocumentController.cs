namespace DocumentManager.Controllers;

using Microsoft.AspNetCore.Mvc;
using DocumentManager.Models.DTO.Document.Request;
using DocumentManager.Models.DTO.Email.Request;
using DocumentManager.Models.DTO.Document.Response;
using DocumentManager.Models.DTO.Category.Response;
using DocumentManager.Models.DTO.CategoryDocument.Response;
using DocumentManager.Models.DTO.UserCategorySubscription.Response;
using DocumentManager.Helpers;
using DocumentManager.Services;
using DocumentManager.Models.DTO.User.Response;
using DocumentManager.Helpers.Authorization;

[ApiController]
[Route("/api/document_manager/documents")]
public class DocumentController : ControllerBase
{
    private readonly IDocumentService _documentService;
    private readonly ICategoryDocumentService _categoryDocumentService;
    private readonly IUserCategorySubscriptionService _userCategorySubscriptionService;
    private readonly IEmailService _emailService;
    private readonly ILogger<DocumentController> _logger;

    public DocumentController(IDocumentService documentService, ICategoryDocumentService categoryDocumentService, IUserCategorySubscriptionService userCategorySubscriptionService, IEmailService emailService, ILogger<DocumentController> logger)
    {
        this._documentService = documentService;
        this._categoryDocumentService = categoryDocumentService;
        this._userCategorySubscriptionService = userCategorySubscriptionService;
        this._emailService = emailService;
        this._logger = logger;
    }

    /**
     * Il faut faire un objet ModelFilter pour les attributs en paramètres 
    */
    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpGet]
    public ActionResult<IEnumerable<DocumentResponse>> GetAll([FromQuery] DocumentFilters filters)
    {
        IEnumerable<DocumentResponse> documents = _documentService.GetAll(filters.CategoryId, filters.Title, filters.Description, filters.IsValidated, filters.AuthorId);
        _logger.LogInformation(LogEvents.ListItems, "[DocumentController][GetAll] - Les documents ont été récupérés avec succès.");
        return Ok(documents);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] DocumentCreateRequest documentRequest)
    {
        if (!ModelState.IsValid)
        {
            List<string> errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            _logger.LogError(LogEvents.InvalidFormatItem, "[DocumentController][Create] - La requête est incorrecte lors de la création du document : {Errors}", errors);
            return this.BadRequest(ModelState);
        }
        DocumentResponse? documentResponse = await _documentService.CreateAsync(documentRequest);
        _logger.LogInformation(LogEvents.InsertItem, string.Format("[DocumentController][Create] - Le document {0} a été crée avec succès.", documentResponse?.Id ?? ""));
        return Ok(documentResponse);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpPut("{id:guid}")]
    public ActionResult<DocumentResponse> UpdateById(Guid id, [FromForm] DocumentUpdateRequest documentRequest)
    {
        if (!ModelState.IsValid)
        {
            List<string> errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            _logger.LogError(LogEvents.InvalidFormatItem, "[DocumentController][UpdateById] - Requête incorrecte lors de la mis à jour du document : {Errors}", errors);
            return this.BadRequest(ModelState);
        }
        DocumentResponse? documentResponse = _documentService.UpdateById(id, documentRequest);
        return Ok(documentResponse);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpPatch("{id:guid}/validate")]
    public ActionResult<DocumentResponse> ValidateById(Guid id, [FromBody] EmailRequest emailRequest)
    {
        if (!ModelState.IsValid)
        {
            List<string> errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            _logger.LogError(LogEvents.InvalidFormatItem, "[DocumentController][ValidateById] - Requête incorrecte lors de la validation du document : {Errors}", errors);
            return this.BadRequest(ModelState);
        }
        DocumentResponse? documentResponse = _documentService.ValidateById(id, emailRequest);
        return Ok(documentResponse);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteById(Guid id)
    {
        DocumentResponse? document = _documentService.GetById(id);
        if (document == null)
        {
            _logger.LogError(LogEvents.GetItemNotFound, string.Format("[DocumentController][DeleteById] - Le document {0} n'a pas été trouvé.", id));
            NotFound(String.Format("Aucun document trouvé pour l'identifiant %d", id));
        }
        await _documentService.DeleteById(id);
        _logger.LogInformation(LogEvents.DeleteItem, string.Format("[DocumentController][DeleteById] - La document {0} a été supprimé avec succès.", id));
        return Ok(new { message = String.Format("Le document {0} a été supprimé.", id) });
    }

}
