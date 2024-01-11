namespace DocumentManager.Helpers.Configuration;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DocumentManager.Models.Entities;

public class RoleConfiguration : IEntityTypeConfiguration<RoleEntity>
{
	public void Configure(EntityTypeBuilder<RoleEntity> builder)
	{
		builder.ToTable("Role");

		builder.HasIndex(r => r.Name).IsUnique();

		builder.HasMany(u => u.Users)
				.WithMany(r => r.Roles)
				.UsingEntity<UserRoleEntity>(
						l => l.HasOne<UserEntity>(e => e.User).WithMany(e => e.UserRoles).HasForeignKey(e => e.UserId),
						r => r.HasOne<RoleEntity>(e => e.Role).WithMany(e => e.UserRoles).HasForeignKey(e => e.RoleId)
				);
	}
}
