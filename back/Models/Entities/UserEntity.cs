namespace DocumentManager.Models.Entities;

using Microsoft.AspNetCore.Identity;

/**
 * customize-identity-model
 Source : https://learn.microsoft.com/en-us/aspnet/core/security/authentication/customize-identity-model?view=aspnetcore-8.0
*/

[Serializable]
public class UserEntity : IdentityUser<Guid>
{
    public DateTime? CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; } = DateTime.Now;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public virtual ICollection<UserRoleEntity> UserRoles { get; set; } = new List<UserRoleEntity>();
    public virtual ICollection<RoleEntity> Roles { get; set; } = new List<RoleEntity>();
    public virtual ICollection<TokenEntity> Tokens { get; set; } = new List<TokenEntity>();
    public virtual ICollection<UserCategorySubscriptionEntity> UserCategorySubscriptions { get; set; } = new List<UserCategorySubscriptionEntity>();
    public virtual ICollection<CategoryEntity> SubscribedCategories { get; set; } = new List<CategoryEntity>();
}
