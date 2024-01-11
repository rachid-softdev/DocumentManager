namespace DocumentManager.Models.DTO.CategoryDocument.Response;

using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using DocumentManager.Models.DTO.Category.Response;
using DocumentManager.Models.DTO.Document.Response;

[Serializable]
public class BaseCategoryDocumentResponse
{
    [JsonPropertyName("category")]
    [ModelBinder(Name = "category")]
    public BaseCategoryResponse? Category { get; set; }

    [JsonPropertyName("document")]
    [ModelBinder(Name = "document")]
    public BaseDocumentResponse? Document { get; set; }
}

[Serializable]
public class CategoryDocumentResponse : BaseCategoryDocumentResponse
{

}