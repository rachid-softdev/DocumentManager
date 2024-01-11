namespace DocumentManager.Helpers.Configuration;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DocumentManager.Models.Entities;

public class UserConfiguration : IEntityTypeConfiguration<UserEntity>
{
    public void Configure(EntityTypeBuilder<UserEntity> builder)
    {
        builder.ToTable("User");

        builder.Property(u => u.CreatedAt)
            .IsRequired()
            .ValueGeneratedOnAdd()
            .HasDefaultValueSql("GETDATE()") // Pour SQL Server
            .HasColumnName("created_at");

        builder.Property(u => u.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(u => u.FirstName)
            .IsRequired()
            .HasColumnName("firstname")
            .HasDefaultValue(string.Empty);

        builder.Property(u => u.LastName)
            .IsRequired()
            .HasColumnName("lastname")
            .HasDefaultValue(string.Empty);

        builder.HasMany(u => u.Roles)
            .WithMany(r => r.Users)
            .UsingEntity<UserRoleEntity>(
                l => l.HasOne<RoleEntity>(e => e.Role).WithMany(e => e.UserRoles).HasForeignKey(e => e.RoleId),
                r => r.HasOne<UserEntity>(e => e.User).WithMany(e => e.UserRoles).HasForeignKey(e => e.UserId)
            );

        builder.HasMany(u => u.SubscribedCategories)
            .WithMany(c => c.Subscribers)
            .UsingEntity<UserCategorySubscriptionEntity>(
                l => l.HasOne<CategoryEntity>(e => e.Category).WithMany(e => e.UserCategorySubscriptions).HasForeignKey(e => e.CategoryId),
                r => r.HasOne<UserEntity>(e => e.User).WithMany(e => e.UserCategorySubscriptions).HasForeignKey(e => e.UserId)
            );
    }
}
