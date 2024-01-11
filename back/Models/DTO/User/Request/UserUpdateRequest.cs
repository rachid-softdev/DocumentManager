namespace DocumentManager.Models.DTO.User.Request;

using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using DocumentManager.Models.DTO.Role.Response;


[Serializable]
public class UserUpdateRequest : IValidatableObject
{
    [Required(ErrorMessage = "Le champ Prénom est obligatoire.")]
    [StringLength(32, MinimumLength = 1, ErrorMessage = "La longueur du champ {0} doit être comprise entre {2} et {1} caractères.")]
    [ModelBinder(Name = "firstname")]
    [JsonPropertyName("firstname")]
    public string? FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le champ Nom est obligatoire.")]
    [StringLength(32, MinimumLength = 1, ErrorMessage = "La longueur du champ {0} doit être comprise entre {2} et {1} caractères.")]
    [ModelBinder(Name = "lastname")]
    [JsonPropertyName("lastname")]
    public string? LastName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Le champ Username est obligatoire.")]
    [StringLength(32, MinimumLength = 1, ErrorMessage = "La longueur du champ {0} doit être comprise entre {2} et {1} caractères.")]
    [ModelBinder(Name = "username")]
    [JsonPropertyName("username")]
    public string? UserName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le champ Email est obligatoire.")]
    [EmailAddress(ErrorMessage = "Le champ Email doit être une adresse email valide.")]
    [ModelBinder(Name = "email")]
    [JsonPropertyName("email")]
    public string? Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le champ Password est obligatoire.")]
    [StringLength(64, MinimumLength = 1, ErrorMessage = "La longueur du champ {0} doit être comprise entre {2} et {1} caractères.")]
    [ModelBinder(Name = "password")]
    [JsonPropertyName("password")]
    public string? Password { get; set; } = string.Empty;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        List<ValidationResult> results = new List<ValidationResult>();
        /*
        // Valider l'unicité de PublicId s'il est spécifié
        if (!string.IsNullOrWhiteSpace(PublicId))
        {
            
            if (IsPublicIdNotUnique(PublicId))
            {
                results.Add(new ValidationResult("PublicId doit être unique.", new[] { "PublicId" }));
            }
        }

        
        if (IsEmailNotUnique(Email))
        {
            results.Add(new ValidationResult("L'adresse email doit être unique.", new[] { "Email" }));
        }
        */

        

        return results;
    }

    private bool IsPublicIdNotUnique(string publicId)
    {
        
        return false;
    }

    private bool IsEmailNotUnique(string email)
    {
        
        return false;
    }
}
