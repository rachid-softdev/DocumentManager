namespace DocumentManager.Helpers.Configuration;

using DocumentManager.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class CategoryConfiguration : IEntityTypeConfiguration<CategoryEntity>
{
    public void Configure(EntityTypeBuilder<CategoryEntity> builder)
    {
        builder.ToTable("Category");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id)
            .IsRequired()
            .ValueGeneratedOnAdd()
            .HasColumnName("id");

        builder.Property(c => c.CreatedAt)
            .IsRequired()
            .ValueGeneratedOnAdd()
            .HasDefaultValueSql("GETDATE()")
            .HasColumnName("created_at");

        builder.Property(c => c.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(255)
            .HasColumnName("name")
            .HasDefaultValue(string.Empty);

        builder.Property(c => c.Description)
            .HasMaxLength(500)
            .HasColumnName("description")
            .HasDefaultValue(string.Empty);

        builder.Property(c => c.ParentCategoryId)
            .HasColumnName("parent_category_id")
            .IsRequired(false); // Peut être nullable

        // Les sous catégories qui appartiennent à une catégorie
        builder.HasMany(c => c.Subcategories)
            .WithOne()
            .HasForeignKey(subcategory => subcategory.ParentCategoryId)
            .OnDelete(DeleteBehavior.Restrict); // pas de suppresion en cascade sinon cycle


        // Les documents qui appartiennent à plusieurs catégories
        builder.HasMany(c => c.Documents)
            .WithMany(c => c.Categories)
            .UsingEntity<CategoryDocumentEntity>(
                l => l.HasOne<DocumentEntity>(e => e.Document).WithMany(e => e.CategoriesDocuments).HasForeignKey(e => e.DocumentId),
                r => r.HasOne<CategoryEntity>(e => e.Category).WithMany(e => e.CategoriesDocuments).HasForeignKey(e => e.CategoryId)
             );

        // Les utilisateurs abonnés à plusieurs catégories
        builder.HasMany(c => c.Subscribers)
            .WithMany(u => u.SubscribedCategories)
            .UsingEntity<UserCategorySubscriptionEntity>(
                l => l.HasOne<UserEntity>(e => e.User).WithMany(e => e.UserCategorySubscriptions).HasForeignKey(e => e.UserId),
                r => r.HasOne<CategoryEntity>(e => e.Category).WithMany(e => e.UserCategorySubscriptions).HasForeignKey(e => e.CategoryId)  
            );
    }
}
