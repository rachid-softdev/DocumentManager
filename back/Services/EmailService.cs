namespace DocumentManager.Services;

using System;
using System.Net;
using System.Net.Mail;
using DocumentManager.Helpers;

public interface IEmailService
{
    void SendEmail(string to, string subject, string body);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly string _smtpServer;
    private readonly string _smtpUsername;
    private readonly string _smtpPassword;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, string smtpServer, string smtpUsername, string smtpPassword, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _smtpServer = !string.IsNullOrEmpty(smtpServer) ? smtpServer : (!string.IsNullOrEmpty(_configuration["Smtp:Server"]) ? _configuration["Smtp:Server"] : "") ?? "";
        _smtpUsername = !string.IsNullOrEmpty(smtpUsername) ? smtpUsername : (!string.IsNullOrEmpty(_configuration["Smtp:Username"]) ? _configuration["Smtp:Username"] : "") ?? "";
        _smtpPassword = !string.IsNullOrEmpty(smtpPassword) ? smtpPassword : (!string.IsNullOrEmpty(_configuration["Smtp:Password"]) ? _configuration["Smtp:Password"] : "") ?? "";
        _logger = logger;
    }

    public void SendEmail(string to, string subject, string body)
    {
        try
        {
            string from = "document-manager@mail.com";
            MailMessage mailMessage = new MailMessage
            {
                From = new MailAddress(from),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            mailMessage.To.Add(to);
            using (SmtpClient smtpClient = new SmtpClient("smtp", 1025))
            {
                // smtpClient.Credentials = new NetworkCredential(_smtpUsername, _smtpPassword);
                smtpClient.Send(mailMessage);
            }
            _logger.LogInformation("[EmailService][SendEmail] - E-mail envoyé avec succès à {0}.", to);
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[EmailService][SendEmail] - Erreur lors de l'envoi de l'e-mail à {0} : {1}", to, ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Erreur lors de l'envoi de l'e-mail.");
        }
    }
}
