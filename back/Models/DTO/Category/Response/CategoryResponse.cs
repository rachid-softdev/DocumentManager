namespace DocumentManager.Models.DTO.Category.Response;

using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using DocumentManager.Models.DTO.Document.Response;
using DocumentManager.Models.DTO.User.Response;

[Serializable]
public class BaseCategoryResponse
{
    [ModelBinder(Name = "id")]
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [ModelBinder(Name = "name")]
    [JsonPropertyName("name")]
    public string? Name { get; set; } = string.Empty;

    [ModelBinder(Name = "description")]
    [JsonPropertyName("description")]
    public string? Description { get; set; } = string.Empty;
}

[Serializable]
public class CategoryResponse : BaseCategoryResponse
{
    [ModelBinder(Name = "subcategories")]
    [JsonPropertyName("subcategories")]
    public ICollection<CategoryResponse> Subcategories { get; set; } = new List<CategoryResponse>();

    [ModelBinder(Name = "subscribers")]
    [JsonPropertyName("subscribers")]
    public ICollection<BaseUserResponse> Subscribers { get; set; } = new List<BaseUserResponse>();

    [ModelBinder(Name = "documents")]
    [JsonPropertyName("documents")]
    public virtual ICollection<BaseDocumentResponse> Documents { get; set; } = new List<BaseDocumentResponse>();
}