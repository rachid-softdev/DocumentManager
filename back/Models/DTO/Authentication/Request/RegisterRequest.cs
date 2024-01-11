namespace DocumentManager.Models.DTO.Authentication.Request;

using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

[Serializable]
public class RegisterRequest
{
    [Required(ErrorMessage = "Le champ prénom est requis.")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Le prénom doit contenir entre {2} et {1} caractères.")]
    [ModelBinder(Name = "firstname")]
    [JsonPropertyName("firstname")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le champ nom est requis.")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Le nom doit contenir entre {2} et {1} caractères.")]
    [ModelBinder(Name = "lastname")]
    [JsonPropertyName("lastname")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le champ email est requis.")]
    [EmailAddress(ErrorMessage = "L'adresse email est invalide.")]
    [ModelBinder(Name = "email")]
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le champ mot de passe est requis.")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Le mot de passe doit contenir au moins {2} caractères.")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$",
        ErrorMessage = "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial.")]
    [ModelBinder(Name = "password")]
    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le champ confirmation du mot de passe est requis.")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "La confirmation du mot de passe doit contenir au moins {2} caractères.")]
    [Compare(nameof(Password), ErrorMessage = "Les mots de passe ne correspondent pas.")]
    [ModelBinder(Name = "confirmed_password")]
    [JsonPropertyName("confirmed_password")]
    public string ConfirmedPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le champ role est requis.")]
    [ModelBinder(Name = "role")]
    [JsonPropertyName("role")]
    public string Role { get; set; } = string.Empty;
}
