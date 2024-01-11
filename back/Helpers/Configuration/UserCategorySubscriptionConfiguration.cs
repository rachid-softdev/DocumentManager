namespace DocumentManager.Helpers.Configuration;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DocumentManager.Models.Entities;

public class UserCategorySubscriptionConfiguration : IEntityTypeConfiguration<UserCategorySubscriptionEntity>
{
    public void Configure(EntityTypeBuilder<UserCategorySubscriptionEntity> builder)
    {
        builder.ToTable("UserCategorySubscription");
        builder.HasKey(ucs => new { ucs.UserId, ucs.CategoryId });
    }
}