namespace DocumentManager.Helpers.Configuration;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DocumentManager.Models.Entities;

public class TokenConfiguration : IEntityTypeConfiguration<TokenEntity>
{
    public void Configure(EntityTypeBuilder<TokenEntity> builder)
    {
        builder.ToTable("Token");

        builder.HasKey(t => t.Id);
        builder.Property(t => t.Id)
            .IsRequired()
            .ValueGeneratedOnAdd();

        builder.Property(t => t.CreatedAt)
            .IsRequired()
            .ValueGeneratedOnAdd()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(t => t.UpdatedAt)
            .IsRequired()
            .ValueGeneratedOnUpdate()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // TEXT pour le token
        builder.Property(t => t.Token)
            .HasColumnType("TEXT")
            .IsUnicode(false);

        builder.Property(t => t.TokenType)
            .IsRequired()
            .HasMaxLength(50)
            .IsUnicode(false)
            .HasConversion<string>();

        builder.Property(t => t.Revoked)
            .IsRequired();

        builder.Property(t => t.Expired)
            .IsRequired();

        builder.Property(t => t.UserId)
            .IsRequired();

        builder.HasOne(t => t.User)
            .WithMany(u => u.Tokens)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

