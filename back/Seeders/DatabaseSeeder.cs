namespace DocumentManager.Seeders;

using System.Reflection.Metadata;
using System.Globalization;
using Bogus;
// Bogus.Extensions : ClampLength(min, max)
using Bogus.Extensions;
using BCrypt.Net;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using DocumentManager.Models.Entities;
using DocumentManager.Helpers;
using DocumentManager.Helpers.Authorization;

[Serializable]
public class DatabaseSeeder
{
    public IReadOnlyCollection<RoleEntity> Roles { get; } = new List<RoleEntity>();
    public IReadOnlyCollection<UserEntity> Users { get; } = new List<UserEntity>();
    public IReadOnlyCollection<UserRoleEntity> UsersRoles { get; } = new List<UserRoleEntity>();
    public IReadOnlyCollection<DocumentEntity> Documents { get; } = new List<DocumentEntity>();
    public IReadOnlyCollection<CategoryEntity> Categories { get; } = new List<CategoryEntity>();
    public IReadOnlyCollection<CategoryEntity> Subcategories { get; } = new List<CategoryEntity>();
    public IReadOnlyCollection<CategoryDocumentEntity> CategoriesDocuments { get; } = new List<CategoryDocumentEntity>();
    public IReadOnlyCollection<UserCategorySubscriptionEntity> UsersCategoriesSubscriptions { get; } = new List<UserCategorySubscriptionEntity>();

    public DatabaseSeeder()
    {
        Roles = DatabaseSeeder.GenerateRoles();
        Users = DatabaseSeeder.GenerateUsers(amount: 3);
        Categories = DatabaseSeeder.GenerateCategories(amount: 3);
        Subcategories = DatabaseSeeder.GenerateSubcategories(amount: 3, Categories);
        Documents = DatabaseSeeder.GenerateDocuments(amount: 3, Users, Categories);
        UsersRoles = DatabaseSeeder.GenerateUsersRoles(amount: 3, Users, Roles);
        CategoriesDocuments = DatabaseSeeder.GenerateCategoriesDocuments(3, Categories, Documents);
        UsersCategoriesSubscriptions = DatabaseSeeder.GenerateUsersCategoriesSubscriptions(3, Users, Categories);
    }

    private static IReadOnlyCollection<RoleEntity> GenerateRoles()
    {
        List<RoleEntity> roles = new List<RoleEntity>();
        HashSet<Role> roleValues = new HashSet<Role>(Enum.GetValues(typeof(Role)).Cast<Role>());
        Faker<RoleEntity> roleFaker = new Faker<RoleEntity>("fr")
            .StrictMode(false)
            .RuleFor(x => x.Id, f => f.Random.Guid())
            .RuleFor(x => x.NormalizedName, f =>
            {
                Role item = roleValues.First();
                return item.ToString();
            })
            .RuleFor(x => x.Name, f =>
            {
                Role item = roleValues.First();
                roleValues.Remove(item);
                return item.ToString();
            });
        roles.AddRange(Enumerable.Range(1, Enum.GetValues(typeof(Role)).Length).Select(i => SeedRow(roleFaker, i)));
        return roles;
    }

    private static IReadOnlyCollection<UserEntity> GenerateUsers(int amount)
    {
        Faker<UserEntity> userFaker = new Faker<UserEntity>("fr")
            .StrictMode(false)
            .RuleFor(x => x.Id, f => f.Random.Guid())
            .RuleFor(x => x.FirstName, f => f.Person.FirstName)
            .RuleFor(x => x.LastName, f => f.Person.LastName)
            .RuleFor(x => x.UserName, f => f.Internet.UserName())
            .RuleFor(x => x.Email, f => f.Internet.Email())
            .RuleFor(x => x.NormalizedUserName, (f, u) => u.UserName?.ToUpper() ?? "")
            .RuleFor(x => x.NormalizedEmail, (f, u) => u.Email?.ToUpper() ?? "")
            .RuleFor(x => x.EmailConfirmed, f => true)
            // .RuleFor(x => x.PasswordHash, f => f.Random.AlphaNumeric(32))
            //.RuleFor(x => x.PasswordHash, f => PasswordUtil.HashPassword("Password123456$"))
            .RuleFor(x => x.PasswordHash, f => BCrypt.HashPassword("Password123456$"))
            .RuleFor(x => x.SecurityStamp, f => f.Random.AlphaNumeric(32))
            .RuleFor(x => x.ConcurrencyStamp, f => f.Random.AlphaNumeric(32))
            .RuleFor(x => x.PhoneNumber, f => f.Phone.PhoneNumber())
            .RuleFor(x => x.PhoneNumberConfirmed, f => f.Random.Bool())
            .RuleFor(x => x.TwoFactorEnabled, f => f.Random.Bool())
            .RuleFor(x => x.LockoutEnd, f => f.Date.FutureOffset())
            .RuleFor(x => x.LockoutEnabled, f => f.Random.Bool())
            .RuleFor(x => x.AccessFailedCount, f => f.Random.Number(0, 10))
            .RuleFor(x => x.CreatedAt, f => f.Date.FutureOffset().DateTime)
            .RuleFor(x => x.UpdatedAt, f => f.Date.FutureOffset().DateTime);
        List<UserEntity> users = Enumerable.Range(1, amount)
            .Select(i => SeedRow(userFaker, i))
            .ToList();
        // Ajout de l'utilisateur admin
        users.Add(new UserEntity
        {
            Id = Guid.NewGuid(),
            FirstName = "admin",
            LastName = "admin",
            // Le UserName = Email car c'est l'identifiant
            UserName = "admin@mail.com",
            NormalizedUserName = "ADMIN@MAIL.COM",
            Email = "admin@mail.com",
            NormalizedEmail = "ADMIN@MAIL.COM",
            EmailConfirmed = true,
            PasswordHash = BCrypt.HashPassword("Admin123456$"),
            // PasswordHash = PasswordUtil.HashPassword("Admin123456$"),
            SecurityStamp = "admin_security_stamp",
            ConcurrencyStamp = "admin_concurrency_stamp",
            PhoneNumberConfirmed = true,
            TwoFactorEnabled = false,
            LockoutEnabled = true,
            AccessFailedCount = 0,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        });
        // Ajout de l'utilisateur user
        users.Add(new UserEntity
        {
            Id = Guid.NewGuid(),
            FirstName = "user",
            LastName = "user",
            // Le UserName = Email car c'est l'identifiant
            UserName = "user@mail.com",
            Email = "user@mail.com",
            NormalizedUserName = "USER@MAIL.COM",
            NormalizedEmail = "USER@MAIL.COM",
            EmailConfirmed = true,
            PasswordHash = BCrypt.HashPassword("User123456$"),
            // PasswordHash = PasswordUtil.HashPassword("User123456$"),
            SecurityStamp = "user_security_stamp",
            ConcurrencyStamp = "user_concurrency_stamp",
            PhoneNumberConfirmed = true,
            TwoFactorEnabled = false,
            LockoutEnabled = false,
            AccessFailedCount = 0,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        });
        return users;
    }

    private static IReadOnlyCollection<DocumentEntity> GenerateDocuments(int amount, IEnumerable<UserEntity> users, IEnumerable<CategoryEntity> categories)
    {
        string pathToSave = Path.Combine(Directory.GetCurrentDirectory(), "Resources", "Documents");
        if (!Directory.Exists(pathToSave))
        {
            Directory.CreateDirectory(pathToSave);
        }
        EmptyFolder(pathToSave);
        Random random = new Random();
        Faker<DocumentEntity> documentFaker = new Faker<DocumentEntity>("fr");
        documentFaker
            .StrictMode(false)
            .RuleFor(x => x.Id, _ => Guid.NewGuid())
            .RuleFor(x => x.CreatedAt, f => f.Date.FutureOffset().DateTime)
            .RuleFor(x => x.UpdatedAt, f => f.Date.FutureOffset().DateTime)
            .RuleFor(x => x.Title, f => f.Commerce.ProductName().ClampLength(1, 64))
            .RuleFor(x => x.Description, f => f.Commerce.ProductDescription().ClampLength(1, 128))
            .RuleFor(x => x.FilePath, f => GenerateAndSaveTextFile(pathToSave))
            .RuleFor(x => x.SenderUserId, f => f.PickRandom(users).Id)
            // .RuleFor(x => x.IsValidated, f => f.Random.Bool())
            // .RuleFor(x => x.IsValidated, f => f.PickRandom(new[] { false, true }))
            .RuleFor(x => x.IsValidated, f => random.Next(2) == 1)
            .RuleFor(x => x.IsValidated, f => random.Next(2) == 1)
            .RuleFor(x => x.ValidatorUserId, (f, x) => (x?.IsValidated == true ? (Guid?)f.PickRandom(users).Id : null) ?? null)
            .RuleFor(x => x.ValidatedAt, (f, x) => (x?.IsValidated == true ? (DateTime?)f.Date.FutureOffset().DateTime : null) ?? null);
        // .RuleFor(x => x.Categories, f => new List<CategoryEntity> { f.PickRandom(categories) });
        List<DocumentEntity> documents = Enumerable.Range(1, amount)
             .Select(i => SeedRow(documentFaker, i))
             .ToList();
        return documents;
    }

    private static IReadOnlyCollection<CategoryEntity> GenerateCategories(int amount)
    {
        Faker<CategoryEntity> categoryFaker = new Faker<CategoryEntity>("fr")
            .StrictMode(false)
            .RuleFor(x => x.Id, _ => Guid.NewGuid())
            .RuleFor(x => x.CreatedAt, f =>
            {
                DateTimeOffset pastDateTime = f.Date.PastOffset(40, DateTime.Now.AddYears(-18));
                string formattedDate = pastDateTime.ToString("dd.MM.yyyy");
                // Utilise DateTime.ParseExact pour garantir que la date est dans le format attendu
                DateTime result = DateTime.ParseExact(formattedDate, "dd.MM.yyyy", CultureInfo.InvariantCulture);
                return result;
            })
            .RuleFor(x => x.UpdatedAt, f => f.Date.FutureOffset().DateTime)
            .RuleFor(x => x.Name, f => f.Commerce.Categories(1).First().ClampLength(1, 64))
            .RuleFor(x => x.Description, f => f.Commerce.ProductDescription().ClampLength(1, 128))
            .RuleFor(x => x.ParentCategoryId, f => null);
        List<CategoryEntity> categories = Enumerable.Range(1, amount)
            .Select(i => SeedRow(categoryFaker, i))
            .ToList();
        return categories;
    }

    private static IReadOnlyCollection<CategoryEntity> GenerateSubcategories(int amount, IEnumerable<CategoryEntity> categories)
    {
        Random random = new Random();
        Faker<CategoryEntity> subcategoryFaker = new Faker<CategoryEntity>("fr")
            .StrictMode(false)
            .RuleFor(x => x.Id, _ => Guid.NewGuid())
            .RuleFor(x => x.CreatedAt, f =>
            {
                DateTimeOffset pastDateTime = f.Date.PastOffset(40, DateTime.Now.AddYears(-18));
                string formattedDate = pastDateTime.ToString("dd.MM.yyyy");
                DateTime result = DateTime.ParseExact(formattedDate, "dd.MM.yyyy", CultureInfo.InvariantCulture);
                return result;
            })
            .RuleFor(x => x.UpdatedAt, f => f.Date.FutureOffset().DateTime)
            .RuleFor(x => x.Name, f => f.Commerce.ProductName().ClampLength(1, 64))
            .RuleFor(x => x.Description, f => f.Commerce.ProductDescription().ClampLength(1, 128));
        List<CategoryEntity> subcategories = Enumerable.Range(1, amount)
            .Select(i =>
            {
                CategoryEntity subcategory = SeedRow(subcategoryFaker, i);
                // Affectation d'une sous catégorie aléatoire
                subcategory.ParentCategoryId = categories.ElementAt(random.Next(0, categories.Count())).Id;
                return subcategory;
            })
            .ToList();
        return subcategories;
    }

    /*---------------------------------------------*/
    /*             LES TABLES DE JOINTURES         */
    /*---------------------------------------------*/

    private static IReadOnlyCollection<UserRoleEntity> GenerateUsersRoles(int amount, IEnumerable<UserEntity> users, IEnumerable<RoleEntity> roles)
    {
        Faker<UserRoleEntity> userRoleFaker = new Faker<UserRoleEntity>("fr")
            .StrictMode(false)
            .RuleFor(x => x.UserId, f => f.PickRandom(users).Id)
            .RuleFor(x => x.RoleId, f => f.PickRandom(roles).Id);
        List<UserRoleEntity> usersRoles = Enumerable.Range(1, amount)
            .Select(i => SeedRow(userRoleFaker, i))
            .ToList();
        // Liaison des utilisateurs et rôles par défaut
        UserEntity? adminUser = users.SingleOrDefault(u => u.UserName == "admin@mail.com");
        UserEntity? userUser = users.SingleOrDefault(u => u.UserName == "user@mail.com");
        RoleEntity? adminRole = roles.SingleOrDefault(r => r.Name == "Admin");
        RoleEntity? userRole = roles.SingleOrDefault(r => r.Name == "User");
        // Clé primaire (UserId, RoleId) : Vérifie s'il existe déjà une liaison pour (UserId, RoleId) avant d'ajouter manuellement
        if (!usersRoles.Any(ur => ur.UserId == adminUser?.Id && ur.RoleId == adminRole?.Id) && adminUser != null && adminRole != null)
        {
            usersRoles.Add(new UserRoleEntity { UserId = adminUser?.Id ?? Guid.Empty, RoleId = adminRole?.Id ?? Guid.Empty });
        }
        if (!usersRoles.Any(ur => ur.UserId == userUser?.Id && ur.RoleId == userRole?.Id) && userUser != null && userRole != null)
        {
            usersRoles.Add(new UserRoleEntity { UserId = userUser?.Id ?? Guid.Empty, RoleId = userRole?.Id ?? Guid.Empty });
        }
        return usersRoles;
    }

    private static IReadOnlyCollection<CategoryDocumentEntity> GenerateCategoriesDocuments(int amount, IEnumerable<CategoryEntity> categories, IEnumerable<DocumentEntity> documents)
    {
        Faker<CategoryDocumentEntity> categoryDocumentFaker = new Faker<CategoryDocumentEntity>("fr")
           .StrictMode(false)
           .RuleFor(d => d.DocumentId, f => f.PickRandom(documents).Id)
           .RuleFor(c => c.CategoryId, f => f.PickRandom(categories).Id);
        List<CategoryDocumentEntity> categoriesDocuments = Enumerable.Range(1, amount)
            .Select(i => SeedRow(categoryDocumentFaker, i))
            .ToList();
        return categoriesDocuments;
    }

    private static IReadOnlyCollection<UserCategorySubscriptionEntity> GenerateUsersCategoriesSubscriptions(int amount, IEnumerable<UserEntity> users, IEnumerable<CategoryEntity> categories)
    {
        Faker<UserCategorySubscriptionEntity> userCategorySubscriptionFaker = new Faker<UserCategorySubscriptionEntity>("fr")
           .StrictMode(false)
           .RuleFor(u => u.UserId, f => f.PickRandom(users).Id)
           .RuleFor(c => c.CategoryId, f => f.PickRandom(categories).Id);
        List<UserCategorySubscriptionEntity> usersCategoriesSubscriptions = Enumerable.Range(1, amount)
            .Select(i => SeedRow(userCategorySubscriptionFaker, i))
            .ToList();
        return usersCategoriesSubscriptions;
    }

    /*------------------------------------------*/
    /*             FONCTIONS UTILES             */
    /*------------------------------------------*/

    private static T SeedRow<T>(Faker<T> faker, int rowId) where T : class
    {
        T? recordRow = faker.UseSeed(rowId).Generate();
        return recordRow;
    }

    private static void EmptyFolder(string folderPath)
    {
        foreach (string file in Directory.GetFiles(folderPath))
        {
            File.Delete(file);
        }
        foreach (string subfolder in Directory.GetDirectories(folderPath))
        {
            Directory.Delete(subfolder, true);
        }
    }

    private static string GenerateAndSaveTextFile(string pathToSave)
    {
        string fileName = Guid.NewGuid().ToString() + ".txt";
        string filePath = Path.Combine(pathToSave, fileName);
        Faker faker = new Faker("fr");
        string fileContent = faker.Lorem.Paragraphs(3);
        File.WriteAllText(filePath, fileContent);
        return filePath.Replace(Directory.GetCurrentDirectory(), "").Replace("\\", "/");
    }

}
