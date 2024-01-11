namespace DocumentManager.Models.DTO.UserRole.Response;

using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using DocumentManager.Models.DTO.User.Response;
using DocumentManager.Models.DTO.Role.Response;

[Serializable]
public class BaseUserRoleResponse
{
    [ModelBinder(Name = "user")]
    [JsonPropertyName("user")]
    public BaseUserResponse? User { get; set; }

    [ModelBinder(Name = "role")]
    [JsonPropertyName("role")]
    public BaseRoleResponse? Role { get; set; }
}

public class UserRoleResponse : BaseUserRoleResponse
{
    
}