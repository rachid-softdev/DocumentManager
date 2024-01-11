namespace DocumentManager.Models.DTO.UserCategorySubscription.Request;

using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using DocumentManager.Models.DTO.User.Response;
using DocumentManager.Models.DTO.Category.Response;

[Serializable]
public class UserCategorySubscriptionCreateRequest
{
    [Required(ErrorMessage = "Le champ User est obligatoire")]
    [ModelBinder(Name = "user")]
    [JsonPropertyName("user")]
    public BaseUserResponse? User { get; set; }

    [Required(ErrorMessage = "Le champ Category est obligatoire")]
    [ModelBinder(Name = "category")]
    [JsonPropertyName("category")]
    public BaseCategoryResponse? Category { get; set; }
}