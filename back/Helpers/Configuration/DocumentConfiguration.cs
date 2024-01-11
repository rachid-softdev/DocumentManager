namespace DocumentManager.Helpers.Configuration;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DocumentManager.Models.Entities;
using System.Reflection.Emit;

public class DocumentConfiguration : IEntityTypeConfiguration<DocumentEntity>
{
    public void Configure(EntityTypeBuilder<DocumentEntity> builder)
    {
        builder.ToTable("Document");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.Id)
            .IsRequired()
            .ValueGeneratedOnAdd()
            .HasColumnName("id");

        builder.Property(d => d.CreatedAt)
            .IsRequired()
            .ValueGeneratedOnAdd()
            .HasDefaultValueSql("GETDATE()") // Pour SQL Server
            .HasColumnName("created_at");

        builder.Property(d => d.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(d => d.Title)
            .IsRequired()
            .HasMaxLength(64)
            .HasColumnName("title")
            .HasDefaultValue(string.Empty);

        builder.Property(d => d.Description)
            .IsRequired()
            .HasMaxLength(255)
            .HasColumnName("description")
            .HasDefaultValue(string.Empty);

        builder.Property(d => d.FilePath)
            .IsRequired()
            .HasMaxLength(128)
            .HasColumnName("file_path")
            .HasDefaultValue(string.Empty);

        builder.Ignore(d => d.FileUrl);
        builder.Ignore(d => d.File);

        builder.Property(d => d.SenderUserId)
            .HasColumnName("SenderUserId");

        builder.HasOne(d => d.SenderUser)
            .WithMany()
            .HasForeignKey(d => d.SenderUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(d => d.ValidatorUserId)
            .HasColumnName("ValidatorUserId");

        builder.HasOne(d => d.ValidatorUser)
            .WithMany()
            .HasForeignKey(d => d.ValidatorUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(d => d.IsValidated)
            .HasColumnName("is_validated");

        builder.Property(d => d.ValidatedAt)
            .HasColumnName("validated_at");

        // Les catégories qui appartient à plusieurs documents
        builder.HasMany(d => d.Categories)
            .WithMany(cd => cd.Documents)
            .UsingEntity<CategoryDocumentEntity>(
                l => l.HasOne<CategoryEntity>(e => e.Category).WithMany(e => e.CategoriesDocuments).HasForeignKey(e => e.CategoryId),
                r => r.HasOne<DocumentEntity>(e => e.Document).WithMany(e => e.CategoriesDocuments).HasForeignKey(e => e.DocumentId)
             );
        
        builder.HasIndex(d => d.FilePath).IsUnique();
    }
}
