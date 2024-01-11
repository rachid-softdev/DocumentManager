namespace DocumentManager.Models.DTO.Authentication.Response;

using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using DocumentManager.Models.DTO.User.Response;

[Serializable]
public class RegisterResponse
{
    [ModelBinder(Name = "user")]
    [JsonPropertyName("user")]
    public UserResponse? User { get; set; }
}
