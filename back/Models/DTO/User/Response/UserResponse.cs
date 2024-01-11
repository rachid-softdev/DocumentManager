namespace DocumentManager.Models.DTO.User.Response;

using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using DocumentManager.Models.DTO.Category.Response;
using DocumentManager.Models.DTO.Role.Response;

[Serializable]
public class BaseUserResponse
{
    [ModelBinder(Name = "id")]
    [JsonPropertyName("id")]
    public string? Id { get; set; } = string.Empty;

    [ModelBinder(Name = "firstname")]
    [JsonPropertyName("firstname")]
    public string? FirstName { get; set; } = string.Empty;

    [ModelBinder(Name = "lastname")]
    [JsonPropertyName("lastname")]
    public string? LastName { get; set; } = string.Empty;

    [ModelBinder(Name = "email")]
    [JsonPropertyName("email")]
    public string? Email { get; set; } = string.Empty;
}

public class UserResponse : BaseUserResponse
{
    [ModelBinder(Name = "roles")]
    [JsonPropertyName("roles")]
    public virtual ICollection<BaseRoleResponse> Roles { get; set; } = new List<BaseRoleResponse>();

    [ModelBinder(Name = "subscribed_categories")]
    [JsonPropertyName("subscribed_categories")]
    public virtual ICollection<BaseCategoryResponse> SubscribedCategories { get; set; } = new List<BaseCategoryResponse>();
}