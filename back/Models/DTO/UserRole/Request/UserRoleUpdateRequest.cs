namespace DocumentManager.Models.DTO.UserRole.Request;

using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using DocumentManager.Models.DTO.User.Response;
using DocumentManager.Models.DTO.Role.Response;

[Serializable]
public class UserRoleUpdateRequest : IValidatableObject
{
    [Required(ErrorMessage = "L'utilisateur est requis.")]
    [ModelBinder(Name = "user")]
    [JsonPropertyName("user")]
    public BaseUserResponse? User { get; set; }

    [Required(ErrorMessage = "Le rôle est requis.")]
    [ModelBinder(Name = "role")]
    [JsonPropertyName("role")]
    public BaseRoleResponse? Role { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        List<ValidationResult> results = new List<ValidationResult>();
        return results;
    }
}
