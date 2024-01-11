namespace DocumentManager.Services;

using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Net;
using AutoMapper;
using BCrypt.Net;
using DocumentManager.Helpers;
using DocumentManager.Models.Entities;
using DocumentManager.Models.DTO.Authentication.Request;
using DocumentManager.Models.DTO.Authentication.Response;
using DocumentManager.Models.DTO.User.Response;
using DocumentManager.Models.DTO.Role.Response;
using DocumentManager.Helpers.Authorization;

public interface IAuthenticationService
{
    Task<RegisterResponse> RegisterAsync(RegisterRequest registerRequest);
    Task<LoginResponse> LoginAsync(LoginRequest loginRequest);
    Task LogoutAsync(string token = "");
}

public class AuthenticationService : IAuthenticationService
{
    private readonly UserManager<UserEntity> _userManager;
    private readonly SignInManager<UserEntity> _signInManager;
    private readonly RoleManager<RoleEntity> _roleManager;
    private readonly ITokenService _tokenService;
    private readonly IJwtUtil _jwtUtils;
    private readonly IConfiguration _configuration;
    private readonly IMapper _mapper;
    private readonly ILogger<AuthenticationService> _logger;


    public AuthenticationService(UserManager<UserEntity> userManager, RoleManager<RoleEntity> roleManager, SignInManager<UserEntity> signInManager, ITokenService tokenService, IJwtUtil jwtUtils, IConfiguration configuration, IMapper mapper, ILogger<AuthenticationService> logger)
    {
        this._userManager = userManager;
        this._signInManager = signInManager;
        this._roleManager = roleManager;
        this._tokenService = tokenService;
        this._jwtUtils = jwtUtils;
        this._configuration = configuration;
        this._mapper = mapper;
        this._logger = logger;
    }

    public async Task<RegisterResponse> RegisterAsync(RegisterRequest registerRequest)
    {
        UserEntity? userExists = await _userManager.FindByEmailAsync(registerRequest.Email);
        if (userExists != null)
        {
            _logger.LogError(LogEvents.GetItemAlreadyExists, String.Format("[AuthenticationService][Register] - L'utilisateur avec l'adresse e-mail {0} existe déja.", registerRequest.Email));
            throw new AppException((int) HttpStatusCode.Conflict, String.Format("L'utilisateur avec l'adresse e-mail {0} existe déja.", registerRequest.Email));
        }
        UserEntity user = new()
        {
            UserName = registerRequest.Email,
            Email = registerRequest.Email,
            NormalizedUserName = registerRequest.Email.ToUpper(),
            NormalizedEmail = registerRequest.Email.ToUpper(),
            EmailConfirmed = true,
            SecurityStamp = Guid.NewGuid().ToString(),
            FirstName = registerRequest.FirstName,
            LastName = registerRequest.LastName,
            ConcurrencyStamp = Guid.NewGuid().ToString(),
            PhoneNumberConfirmed = true,
            TwoFactorEnabled = false,
            LockoutEnabled = false,
            AccessFailedCount = 0,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now,
            PasswordHash = BCrypt.HashPassword(registerRequest.Password)
        };
        IdentityResult createUserResult = await _userManager.CreateAsync(user);
        if (!createUserResult.Succeeded)
        {
            _logger.LogError(LogEvents.InternalError, String.Format("La création du compte a échoué, vérifier vos informations."));
            throw new AppException((int) HttpStatusCode.BadRequest, String.Format("La création du compte a échoué, vérifier vos informations."));
        }
        await _userManager.AddToRoleAsync(user, Role.User.ToString().ToUpper());
        IList<string> roles = await _userManager.GetRolesAsync(user);
        RoleEntity?[] roleEntities = await Task.WhenAll(roles.Select(roleName => _roleManager.FindByNameAsync(roleName)));
        return new RegisterResponse
        {
            User = _mapper.Map<UserResponse>(user, opt =>
            {
                opt.Items["Roles"] = _mapper.Map<List<BaseRoleResponse>>(roleEntities.Where(roleEntity => roleEntity != null).ToList());
            })
        };
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest loginRequest)
    {
        try
        {
            UserEntity? user = await _userManager.FindByNameAsync(loginRequest.Email);
            if (user == null)
            {
                _logger.LogError(LogEvents.GetItemNotFound, "[AuthenticationService][Login] - Identifiant ou mot de passe invalide. Utilisateur non trouvé.");
                throw new AppException((int) HttpStatusCode.BadRequest, "Identifiant ou mot de passe invalide.");
            }
            if (!BCrypt.Verify(loginRequest.Password, user.PasswordHash))
            {
                _logger.LogError(LogEvents.GetItemNotFound, "[AuthenticationService][Login] - Identifiant ou mot de passe invalide. Échec de l'authentification.");
                throw new AppException((int)HttpStatusCode.BadRequest, "Identifiant ou mot de passe invalide.");
            }
            IList<string> roles = await _userManager.GetRolesAsync(user);
            RoleEntity?[] roleEntities = await Task.WhenAll(roles.Select(roleName => _roleManager.FindByNameAsync(roleName)));
            _logger.LogInformation(LogEvents.ListItems, "[AuthenticationService][Login] - Utilisateur connecté avec succès : {0}", user.UserName);
            UserResponse userResponse = _mapper.Map<UserResponse>(user, opt =>
            {
                opt.Items["Roles"] = _mapper.Map<List<BaseRoleResponse>>(roleEntities.Where(roleEntity => roleEntity != null).ToList());
            });
            string jwtToken = _jwtUtils.GenerateJwtToken(userResponse);
            await this.RevokeAllUserTokens(user);
            await this.SaveUserToken(user, jwtToken);
            return new LoginResponse
            {
                Token = jwtToken,
                User = userResponse
            };
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[AuthenticationService][Login] - Une erreur s'est produite lors de la connexion : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Identifiant ou mot de passe invalide.");
        }
    }

    public async Task LogoutAsync(string token = "")
    {
        try
        {
            TokenEntity? storedToken = null;
            try
            {
                storedToken = await _tokenService.GetByTokenAsync(token);
            } catch (Exception ex)
            {
                throw new AppException((int) HttpStatusCode.BadRequest, ex.Message);
            }
            if (storedToken != null)
            {
                storedToken.Expired = true;
                storedToken.Revoked = true;
                await _tokenService.UpdateAsync(storedToken);
            }
            else
            {
                throw new AppException((int) HttpStatusCode.NotFound, "[AuthenticationService][Logout] - Une erreur s'est produite lors de la déconnexion.");
            }
            _logger.LogInformation(LogEvents.ListItems, "[AuthenticationService][Logout] - Utilisateur déconnecté avec succès.");
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[AuthenticationService][Logout] - Une erreur s'est produite lors de la déconnexion : {0}", ex.Message);
            throw new AppException((int) HttpStatusCode.InternalServerError, "[AuthenticationService][Logout] - Une erreur s'est produite lors de la déconnexion : {0}", ex.Message);
        }
    }

    private async Task SaveUserToken(UserEntity user, string jwtToken)
    {
        TokenEntity token = new TokenEntity
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now,
            Token = jwtToken,
            TokenType = TokenType.Bearer,
            Revoked = false,
            Expired = false,
            UserId = user.Id,
            User = user
        };
        await _tokenService.CreateAsync(token);
    }

    private async Task RevokeAllUserTokens(UserEntity user)
    {
        List<TokenEntity> validUserTokens = _tokenService.GetAllValidByUserId(user.Id).ToList();
        if (validUserTokens.Count == 0)
            return;
        foreach (TokenEntity token in validUserTokens)
        {
            token.Expired = true;
            token.Revoked = true;
            await _tokenService.UpdateAsync(token);
        }
    }

    /**
     * Cetté méthode était utilisé pour l'authentification avec JWT manuellement mais maintenant
     c'est le SignInManager qui s'occupe de gérer l'authentification.
    */
    private string GenerateToken(IEnumerable<Claim> claims)
    {
        string? jwtKeySecret = _configuration["JWTKey:Secret"];
        string? validIssuer = _configuration["JWTKey:ValidIssuer"];
        string? validAudience = _configuration["JWTKey:ValidAudience"];
        string? tokenExpiryTimeInHour = _configuration["JWTKey:TokenExpiryTimeInHour"];
        if (string.IsNullOrEmpty(jwtKeySecret) || string.IsNullOrEmpty(validIssuer) || string.IsNullOrEmpty(validAudience) || string.IsNullOrEmpty(tokenExpiryTimeInHour))
        {
            throw new InvalidOperationException("La configuration JWTKey est incomplète.");
        }
        SymmetricSecurityKey authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKeySecret));
        if (!long.TryParse(tokenExpiryTimeInHour, out long tokenExpiryTime))
        {
            throw new InvalidOperationException("La valeur de TokenExpiryTimeInHour dans la configuration JWTKey n'est pas un nombre valide.");
        }
        SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = validIssuer,
            Audience = validAudience,
            Expires = DateTime.UtcNow.AddHours(tokenExpiryTime),
            SigningCredentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256),
            Subject = new ClaimsIdentity(claims)
        };
        JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
        SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
