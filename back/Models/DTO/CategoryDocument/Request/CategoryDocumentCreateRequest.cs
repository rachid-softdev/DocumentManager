namespace DocumentManager.Models.DTO.CategoryDocument.Request;

using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using DocumentManager.Models.DTO.Category.Response;
using DocumentManager.Models.DTO.Document.Response;

[Serializable]
public class CategoryDocumentCreateRequest
{
    [Required(ErrorMessage = "Le champ Category est obligatoire")]
    [ModelBinder(Name = "category")]
    [JsonPropertyName("category")]
    public BaseCategoryResponse? Category { get; set; }

    [Required(ErrorMessage = "Le champ Document est obligatoire")]
    [ModelBinder(Name = "document")]
    [JsonPropertyName("document")]
    public BaseDocumentResponse? Document { get; set; }
}