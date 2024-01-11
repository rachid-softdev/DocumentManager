namespace DocumentManager.Models.DTO.Authentication.Response;

using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using DocumentManager.Models.DTO.User.Response;

[Serializable]
public class LoginResponse
{
    [ModelBinder(Name = "access_token")]
    [JsonPropertyName("access_token")]
    public string? Token { get; set; } = string.Empty;

    [ModelBinder(Name = "user")]
    [JsonPropertyName("user")]
    public UserResponse? User { get; set; }
}
