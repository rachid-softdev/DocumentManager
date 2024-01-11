namespace DocumentManager.Helpers.Configuration;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DocumentManager.Models.Entities;
using System.Reflection.Emit;

public class CategoryDocumentConfiguration : IEntityTypeConfiguration<CategoryDocumentEntity>
{
    public void Configure(EntityTypeBuilder<CategoryDocumentEntity> builder)
    {
        builder.ToTable("CategoryDocument");
        builder.HasKey(cdc => new { cdc.CategoryId, cdc.DocumentId }); 
    }
}
