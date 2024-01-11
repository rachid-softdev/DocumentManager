namespace DocumentManager.Helpers;

using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using DocumentManager.Models.Entities;
using DocumentManager.Seeders;
using DocumentManager.Helpers.Configuration;
using Microsoft.AspNetCore.Identity;

/**
 * Les entités personnalisés :
 * UserEntity, RoleEntity, UserRoleEntity
 * Les entités de AspNetCore
 * Les autres entités proviennent de AspNetCore
 * IdentityUserClaim, IdentityUserLogin, IdentityRoleClaim, IdentityUserToken
*/
public class ApplicationDbContext : IdentityDbContext<UserEntity, RoleEntity, Guid, IdentityUserClaim<Guid>, UserRoleEntity, IdentityUserLogin<Guid>, IdentityRoleClaim<Guid>, IdentityUserToken<Guid>>
{
    public DbSet<TokenEntity> Tokens { get; set; }
    public DbSet<CategoryEntity> Categories { get; set; }
    public DbSet<DocumentEntity> Documents { get; set; }
    public DbSet<CategoryDocumentEntity> CategoriesDocuments { get; set; }
    public DbSet<UserCategorySubscriptionEntity> UsersCategoriesSubscriptions { get; set; }

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options) : base(options)
    {

    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        /**
            * Pour le lazy loading : 
            https://learn.microsoft.com/en-us/ef/core/querying/related-data/lazy
        */
        options.UseLazyLoadingProxies();
        base.OnConfiguring(options);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        /**
         * Entity Framework Core :
         * J'ai choisit d'utiliser avec les méthodes au lieu des annotations sur les entités
         * car les méthodes offrent davantage de possibilités
        */
        // Configuration des tables
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new RoleConfiguration());
        modelBuilder.ApplyConfiguration(new TokenConfiguration());
        modelBuilder.ApplyConfiguration(new CategoryConfiguration());
        modelBuilder.ApplyConfiguration(new DocumentConfiguration());
        modelBuilder.ApplyConfiguration(new UserRoleConfiguration());
        modelBuilder.ApplyConfiguration(new CategoryDocumentConfiguration());
        modelBuilder.ApplyConfiguration(new UserCategorySubscriptionConfiguration());
        // Générations des données - Generate seed data with Bogus
        DatabaseSeeder databaseSeeder = new DatabaseSeeder();
        // Affectation des données générées
        modelBuilder.Entity<RoleEntity>().HasData(databaseSeeder.Roles);
        modelBuilder.Entity<UserEntity>().HasData(databaseSeeder.Users);
        modelBuilder.Entity<TokenEntity>();
        modelBuilder.Entity<CategoryEntity>().HasData(databaseSeeder.Categories);
        modelBuilder.Entity<DocumentEntity>().HasData(databaseSeeder.Documents);
        modelBuilder.Entity<CategoryEntity>().HasData(databaseSeeder.Subcategories);
        modelBuilder.Entity<UserRoleEntity>().HasData(databaseSeeder.UsersRoles);
        modelBuilder.Entity<CategoryDocumentEntity>().HasData(databaseSeeder.CategoriesDocuments);
        modelBuilder.Entity<UserCategorySubscriptionEntity>().HasData(databaseSeeder.UsersCategoriesSubscriptions);
        base.OnModelCreating(modelBuilder);
    }
}

