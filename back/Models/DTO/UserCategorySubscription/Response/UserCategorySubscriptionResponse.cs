namespace DocumentManager.Models.DTO.UserCategorySubscription.Response;

using DocumentManager.Models.DTO.User.Response;
using DocumentManager.Models.DTO.Category.Response;
using DocumentManager.Models.Entities;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;


[Serializable]
public class BaseUserCategorySubscriptionResponse
{
    [ModelBinder(Name = "user")]
    [JsonPropertyName("user")]
    public BaseUserResponse? User { get; set; }

    [ModelBinder(Name = "category")]
    [JsonPropertyName("category")]
    public BaseCategoryResponse? Category { get; set; }
}

[Serializable]
public class UserCategorySubscriptionResponse : BaseUserCategorySubscriptionResponse
{

}