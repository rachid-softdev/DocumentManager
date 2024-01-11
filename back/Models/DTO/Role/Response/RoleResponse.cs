namespace DocumentManager.Models.DTO.Role.Response;

using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using DocumentManager.Models.DTO.User.Response;

[Serializable]
public class BaseRoleResponse
{
    [ModelBinder(Name = "id")]
    [JsonPropertyName("id")]
    public Guid Id { get; set; } = Guid.Empty;

    [ModelBinder(Name = "name")]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
}

[Serializable]
public class RoleResponse : BaseRoleResponse
{
    [ModelBinder(Name = "users")]
    [JsonPropertyName("users")]
    public virtual ICollection<BaseUserResponse> Users { get; set; } = new List<BaseUserResponse>();
}