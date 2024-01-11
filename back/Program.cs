using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.FileProviders;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using DocumentManager.Helpers;
using DocumentManager.Helpers.Authorization;
using DocumentManager.Models.Entities;
using DocumentManager.Repositories;
using DocumentManager.Services;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddProblemDetails();

// AutoMapper
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
// Configuration d'un Profile AutoMapper
/*
var config = new MapperConfiguration(cfg =>
{
    cfg.AddProfile(new MappingProfiles());
});
var mapper = config.CreateMapper();
builder.Services.AddSingleton(map);
*/

// MultiPartBodyLength error : https://code-maze.com/upload-files-dot-net-core-angular/
// Configuration des options de formulaire pour autoriser des tailles conséquentes
builder.Services.Configure<FormOptions>(o =>
{
    o.ValueLengthLimit = int.MaxValue;
    o.MultipartBodyLengthLimit = int.MaxValue;
    o.MemoryBufferThreshold = int.MaxValue;
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Database
// Register the dbcontext before you configure the Identity store
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DocumentManagerDatabase"), sqlServerOptions =>
    {
        /**
         * Active le mécanisme de réessai automatique sur les échecs transitoires.
         * Les échecs transitoires sont des erreurs temporaires qui peuvent survenir,
         * tels qu'une perte momentanée de connexion à la base de données.
        */
        sqlServerOptions.EnableRetryOnFailure(3);
    });
}, ServiceLifetime.Scoped);
builder.Services.AddIdentity<UserEntity, RoleEntity>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();
// builder.Services.AddDatabaseDeveloperPageExceptionFilter();

/*-----------------------------------------------------------------------------------------*/
/*                      DEPENDENCIES INJECTION - SERVICES LIFES TIMES                      */
/*-----------------------------------------------------------------------------------------*/
/**
 * Transient : Une instance par appel
 * Scoped : Une instance par requête
 * Singleton : Une instance pour l’ensemble de l’application
*/
// builder.Services.AddTransient<IUserRepository, UserRepository>();
// builder.Services.AddSingleton<IUserRepository, UserRepository>();
// Injection des dépendances des services
builder.Services.AddScoped<IJwtUtil, JwtUtil>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IDocumentService, DocumentService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IUserRoleService, UserRoleService>();
builder.Services.AddScoped<ICategoryDocumentService, CategoryDocumentService>();
builder.Services.AddScoped<IUserCategorySubscriptionService, UserCategorySubscriptionService>();
builder.Services.AddScoped<IEmailService>(provider =>
{
    string smtpServer = builder.Configuration["Smtp:Server"] ?? "";
    string smtpUsername = builder.Configuration["Smtp:Username"] ?? "";
    string smtpPassword = builder.Configuration["Smtp:Password"] ?? "";
    IConfiguration configuration = provider.GetRequiredService<IConfiguration>();
    ILogger<EmailService> logger = provider.GetRequiredService<ILogger<EmailService>>();
    /*
    if (string.IsNullOrEmpty(smtpServer) || string.IsNullOrEmpty(smtpUsername) || string.IsNullOrEmpty(smtpPassword))
    {
        throw new InvalidOperationException("La configuration SMTP est incomplète.");
    }*/
    return new EmailService(configuration, smtpServer, smtpUsername, smtpPassword, logger);
});
// Injection des dépendances des repositories
builder.Services.AddScoped<ITokenRepository, TokenRepository>();
builder.Services.AddScoped<IUserRoleRepository, UserRoleRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IDocumentRepository, DocumentRepository>();
builder.Services.AddScoped<ICategoryDocumentRepository, CategoryDocumentRepository>();
builder.Services.AddScoped<IUserCategorySubscriptionRepository, UserCategorySubscriptionRepository>();
/**
 * Bien que le UserRepository soit maintenu dans le service, 
 * il peut être remplacé par le UserManager fourni par Dotnet, 
 * car il effectue les mêmes opérations.
 * UserManager pour le modèle IdentityUser => UserRepository pour le modèle UserEntity
 * Il y a aussi le RoleManager ect
 * Ceux sont des modèles et avec leur services fournit par Microsoft.AspNetCore.Identity
 * https://learn.microsoft.com/fr-fr/dotnet/api/microsoft.aspnetcore.identity
 * Pareillement pour Role
*/
builder.Services.AddScoped<UserManager<UserEntity>>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<RoleManager<RoleEntity>>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();

/**
 * Profondeur des cycles JSON
 */
//builder.Services.AddControllers().AddJsonOptions(x => {
//        x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
//        x.JsonSerializerOptions.MaxDepth = 2;
//    }
//);
/*
builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.MaxDepth = 3;
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        });
builder.Services.Configure<JsonOptions>(options =>
{
    options.JsonSerializerOptions.MaxDepth = 3;
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});
*/

/*----------------------------------------------------------*/
/*                      AUTHENTICATION                      */
/*----------------------------------------------------------*/

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(o =>
{
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = builder.Configuration["JWTKey:Issuer"],
        ValidAudience = builder.Configuration["JWTKey:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey
        (Encoding.UTF8.GetBytes(builder.Configuration["JWTKey:Secret"] ?? "")),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = false,
        ValidateIssuerSigningKey = true
    };
});

/*---------------------------------------------------------*/
/*                      AUTHORIZATION                      */
/*---------------------------------------------------------*/

builder.Services.AddAuthorization();

/*---------------------------------------------------*/
/*                      LOGGING                      */
/*---------------------------------------------------*/

/**
 * Logging :
 * https://learn.microsoft.com/en-us/aspnet/core/fundamentals/logging/
 * Pour créer implicitement un scope avec SpanId, TraceId, ParentId,Baggage, and Tags :
*/
builder.Logging.AddSimpleConsole(options =>
{
    options.IncludeScopes = true;
});
builder.Logging.Configure(options =>
{
    options.ActivityTrackingOptions = ActivityTrackingOptions.SpanId
                                       | ActivityTrackingOptions.TraceId
                                       | ActivityTrackingOptions.ParentId
                                       | ActivityTrackingOptions.Baggage
                                       | ActivityTrackingOptions.Tags;
});

/*----------------------------------------------------------*/
/*                      Application                         */
/*----------------------------------------------------------*/

// https://jasonwatmore.com/net-7-dapper-postgresql-crud-api-tutorial-in-aspnet-core
WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

using (IServiceScope scope = app.Services.CreateScope())
{
    ApplicationDbContext context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    // Supprime la base de données si elle existe
    context.Database.EnsureDeleted();
    // Crée la base de données si elle n'existe pas
    context.Database.EnsureCreated();
    // context.Database.Migrate();
}

// configure HTTP request pipeline
{

    // JWT Middleware
    app.UseMiddleware<JwtMiddleware>();
    // global error handler
    app.UseMiddleware<ErrorHandlerMiddleware>();

    // app.UsePathBase("/api/document_manager");
    app.UseRouting();

    // global cors policy
    app.UseCors(x => x
        // .SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost" && new Uri(origin).Port == 4200)
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());

    // Ne pas décommenter car c'est le ErrorHandlerMiddleware qui s'occupe de la gestion d'exception
    // app.UseExceptionHandler();
    // app.UseStatusCodePages();
    
    // Https
    app.UseHttpsRedirection();
    // Authentication
    app.UseAuthentication();
    // Authorization
    app.UseAuthorization();

    // Fichiers statiques
    string folderName = "Resources";
    string subFolderName = "Documents";
    string pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName, subFolderName);
    if (!Directory.Exists(pathToSave))
    {
        Directory.CreateDirectory(pathToSave);
    }
    /** En commentaire sinon ça supprime les fichiers déja générés dans DatabaseSeeder, lors du AddDbContext */
    /*
    // Vide le contenu du dossier
    foreach (var file in Directory.GetFiles(pathToSave))
    {
        File.Delete(file);
    }
    // Vide le contenu des sous dossiers
    foreach (var subfolder in Directory.GetDirectories(pathToSave))
    {
        Directory.Delete(subfolder, true);
    }
    */
    app.UseStaticFiles(new StaticFileOptions()
    {
        FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
        RequestPath = new PathString("/Resources")
    });

    app.MapControllers();
}
app.Run();
