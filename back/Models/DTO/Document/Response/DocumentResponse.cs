namespace DocumentManager.Models.DTO.Document.Response;

using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using DocumentManager.Models.DTO.User.Response;
using DocumentManager.Models.DTO.Category.Response;

[Serializable]
public class BaseDocumentResponse
{
    [ModelBinder(Name = "id")]
    [JsonPropertyName("id")]
    public string? Id { get; set; } = string.Empty;

    [ModelBinder(Name = "title")]
    [JsonPropertyName("title")]
    public string? Title { get; set; } = string.Empty;

    [ModelBinder(Name = "description")]
    [JsonPropertyName("description")]
    public string? Description { get; set; } = string.Empty;

    [ModelBinder(Name = "file_url")]
    [JsonPropertyName("file_url")]
    public string? FileUrl { get; set; } = string.Empty;

    [ModelBinder(Name = "sender_user")]
    [JsonPropertyName("sender_user")]
    public BaseUserResponse? SenderUser { get; set; }

    [ModelBinder(Name = "validator_user")]
    [JsonPropertyName("validator_user")]
    public BaseUserResponse? ValidatorUser { get; set; }

    [ModelBinder(Name = "is_validated")]
    [JsonPropertyName("is_validated")]
    public bool? IsValidated { get; set; } = false;

    [ModelBinder(Name = "validated_at")]
    [JsonPropertyName("validated_at")]
    public DateTime? ValidatedAt { get; set; }
}

[Serializable]
public class DocumentResponse : BaseDocumentResponse
{
    [JsonPropertyName("categories")]
    public virtual ICollection<BaseCategoryResponse> Categories { get; set; } = new List<BaseCategoryResponse>();
}