namespace DocumentManager.Models.DTO.Authentication.Request;

using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

[Serializable]
public class LoginRequest
{
    [Required(ErrorMessage = "Le champ email est requis.")]
    [EmailAddress(ErrorMessage = "L'adresse email est invalide.")]
    [ModelBinder(Name = "email")]
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le champ mot de passe est requis.")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$",
        ErrorMessage = "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial.")]
    [ModelBinder(Name = "password")]
    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;
}
