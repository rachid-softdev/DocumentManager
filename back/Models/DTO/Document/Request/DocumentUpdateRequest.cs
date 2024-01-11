namespace DocumentManager.Models.DTO.Document.Request;

using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using DocumentManager.Models.DTO.User;
using DocumentManager.Models.DTO.User.Response;

[Serializable]
public class DocumentUpdateRequest
{
    [Required(ErrorMessage = "Le champ Titre est obligatoire")]
    [StringLength(64, MinimumLength = 1, ErrorMessage = "La longueur du champ {0} doit être comprise entre {2} et {1} caractères.")]
    [ModelBinder(Name = "title")]
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [StringLength(128, MinimumLength = 1, ErrorMessage = "La longueur du champ {0} doit être comprise entre {2} et {1} caractères.")]
    [ModelBinder(Name = "description")]
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Veuillez sélectionner un fichier")]
    [ModelBinder(Name = "file")]
    [JsonPropertyName("file")]
    public IFormFile? File { get; set; }

    [ModelBinder(Name = "sender_user")]
    [JsonPropertyName("sender_user")]
    public BaseUserResponse? SenderUser { get; set; }

    [ModelBinder(Name = "validator_user")]
    [JsonPropertyName("validator_user")]
    public BaseUserResponse? ValidatorUser { get; set; }

    [ModelBinder(Name = "is_validated")]
    [JsonPropertyName("is_validated")]
    public bool? IsValidated { get; set; }

    [ModelBinder(Name = "validated_at")]
    [JsonPropertyName("validated_at")]
    public DateTime? ValidatedAt { get; set; } = DateTime.Now;

}