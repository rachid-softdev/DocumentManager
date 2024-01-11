namespace DocumentManager.Models.DTO.Email.Request;

using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

[Serializable]
public class EmailRequest
{
	[Required(ErrorMessage = "Le champ To est obligatoire")]
	[EmailAddress(ErrorMessage = "Veuillez entrer une adresse e-mail valide")]
	[ModelBinder(Name = "to")]
	[JsonPropertyName("to")]
	public string To { get; set; } = string.Empty;

	[Required(ErrorMessage = "Le champ Subject est obligatoire")]
	[StringLength(64, MinimumLength = 1, ErrorMessage = "La longueur du champ {0} doit être comprise entre {2} et {1} caractères.")]
	[ModelBinder(Name = "subject")]
	[JsonPropertyName("subject")]
	public string Subject { get; set; } = string.Empty;

	[Required(ErrorMessage = "Le champ Template est obligatoire")]
	[ModelBinder(Name = "template")]
	[JsonPropertyName("template")]
	public string Template { get; set; } = string.Empty;
}
