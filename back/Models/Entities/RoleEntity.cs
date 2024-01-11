namespace DocumentManager.Models.Entities;

using Microsoft.AspNetCore.Identity;

/**
 * customize-identity-model
 Source : https://learn.microsoft.com/en-us/aspnet/core/security/authentication/customize-identity-model?view=aspnetcore-8.0
*/

[Serializable]
public class RoleEntity : IdentityRole<Guid>
{
	public virtual ICollection<UserRoleEntity> UserRoles { get; set; } = new List<UserRoleEntity>();
	public virtual ICollection<UserEntity> Users { get; set; } = new List<UserEntity>();
}