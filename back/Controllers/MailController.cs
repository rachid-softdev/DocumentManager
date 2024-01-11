namespace DocumentManager.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DocumentManager.Models.DTO.Email.Request;
using DocumentManager.Services;
using DocumentManager.Helpers;
using DocumentManager.Helpers.Authorization;

[ApiController]
[Route("/api/document_manager/mail")]
public class EmailController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly ILogger<EmailController> _logger;

    public EmailController(IEmailService emailService, ILogger<EmailController> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpPost("send")]
    public IActionResult SendEmail([FromBody] EmailRequest emailRequest)
    {
        try
        {
            _emailService.SendEmail(emailRequest.To, emailRequest.Subject, emailRequest.Template);
            _logger.LogInformation(LogEvents.InsertItem, string.Format("[EmailController][SendEmail] - L'email a été envoyé avec succès à {0}.", emailRequest.To));
            return Ok(new { Message = "L'email a été envoyé avec succès." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, string.Format("[EmailController][SendEmail] - Une erreur est survenue lors de l'envoie de l'email à {0}.", emailRequest.To));
            // Gérez les erreurs d'envoi d'e-mail ici
            return StatusCode(500, new { ErrorMessage = "Une erreur est survenue lors de l'envoie de l'email.", ExceptionMessage = ex.Message });
        }
    }
}
