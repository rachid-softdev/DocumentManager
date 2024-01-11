namespace DocumentManager.Models.DTO.Category.Request;

using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Serializable]
public class CategoryUpdateRequest
{
    [Required(ErrorMessage = "Le champ Name est obligatoire.")]
    [StringLength(64, MinimumLength = 1, ErrorMessage = "La longueur du champ {0} doit être comprise entre {2} et {1} caractères.")]
    [ModelBinder(Name = "name")]
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [Required(ErrorMessage = "Le champ Description est obligatoire.")]
    [StringLength(128, MinimumLength = 1, ErrorMessage = "La longueur du champ {0} doit être comprise entre {2} et {1} caractères.")]
    [ModelBinder(Name = "description")]
    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [ModelBinder(Name = "parent_category_id")]
    [JsonPropertyName("parent_category_id")]
    public Guid? ParentCategoryId { get; set; }
}
