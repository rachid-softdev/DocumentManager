namespace DocumentManager.Models.DTO.Role.Request;

using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;


[Serializable]
public class RoleUpdateRequest
{
	[Required(ErrorMessage = "Le champ Name est obligatoire")]
	[StringLength(32, MinimumLength = 1, ErrorMessage = "La longueur du champ {0} doit être comprise entre {2} et {1} caractères.")]
	[ModelBinder(Name = "name")]
	[JsonPropertyName("name")]
	public string Name { get; set; } = string.Empty;
}