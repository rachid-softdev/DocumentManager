namespace DocumentManager.Models.Entities;

using Microsoft.AspNetCore.Identity;

/**
 * https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.identity.entityframeworkcore.identityuserrole-1?view=aspnetcore-1.1
 * les clés étrangères UserId et RoleId sont déja présentes dans IdentityUserRole et pas de override
*/
[Serializable]
public class UserRoleEntity : IdentityUserRole<Guid>
{
	
	// public Guid UserId { get; set; } = Guid.NewGuid();
	public virtual UserEntity? User { get; set; }
	// public Guid RoleId { get; set; } = Guid.NewGuid();
	public virtual RoleEntity? Role { get; set; }
}