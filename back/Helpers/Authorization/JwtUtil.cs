namespace DocumentManager.Helpers.Authorization;

using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DocumentManager.Models.DTO.User.Response;
using DocumentManager.Services;
using DocumentManager.Models.Entities;

public interface IJwtUtil
{
    public string GenerateJwtToken(BaseUserResponse user);
    public Guid? ValidateJwtToken(string? token);
}

public class JwtUtil : IJwtUtil
{
    private readonly IConfiguration _configuration;
    private readonly ITokenService _tokenService;

    private Dictionary<string, string> _jwtKeyConfigMap;

    public JwtUtil(IConfiguration configuration, ITokenService tokenService)
    {
        this._configuration = configuration;
        this._tokenService = tokenService;
        this._jwtKeyConfigMap = new Dictionary<string, string>();
        this.initiliazeJwtConfiguration();
    }

    private void initiliazeJwtConfiguration()
    {
        this._jwtKeyConfigMap = new Dictionary<string, string>();
        AddConfigToDictionary("Secret", "JWTKey:Secret");
        AddConfigToDictionary("ValidIssuer", "JWTKey:ValidIssuer");
        AddConfigToDictionary("ValidAudience", "JWTKey:ValidAudience");
        AddConfigToDictionary("TokenExpiryTimeInHour", "JWTKey:TokenExpiryTimeInHour");
        ValidateJwtConfiguration();
    }

    private void AddConfigToDictionary(string key, string configKey)
    {
        string? configValue = _configuration[configKey];
        if (configValue != null)
        {
            this._jwtKeyConfigMap.Add(key, configValue);
        }
    }

    private void ValidateJwtConfiguration()
    {
        if (_jwtKeyConfigMap.Any(kvp => string.IsNullOrEmpty(kvp.Value)))
        {
            string missingKeys = string.Join(", ", _jwtKeyConfigMap.Where(kvp => string.IsNullOrEmpty(kvp.Value)).Select(kvp => kvp.Key));
            throw new InvalidOperationException($"La configuration JWTKey est incomplète. Les clés manquantes sont : {missingKeys}");
        }
    }

    public string GenerateJwtToken(BaseUserResponse user)
    {

        string? jwtKeySecret = _jwtKeyConfigMap["Secret"];
        string? validIssuer = _jwtKeyConfigMap["ValidIssuer"];
        string? validAudience = _jwtKeyConfigMap["ValidAudience"];
        string? tokenExpiryTimeInHour = _jwtKeyConfigMap["TokenExpiryTimeInHour"];
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
            Subject = new ClaimsIdentity(new[] { new Claim("id", user?.Id?.ToString() ?? "") })
        };
        JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
        SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public Guid? ValidateJwtToken(string? token)
    {
        if (token == null)
            return null;
        TokenEntity? tokenEntity = this._tokenService.GetByTokenAsync(token)?.Result;
        if (tokenEntity == null)
            return null;
        string? jwtKeySecret = _jwtKeyConfigMap["Secret"];
        var tokenHandler = new JwtSecurityTokenHandler();
        byte[]? key = Encoding.ASCII.GetBytes(jwtKeySecret);
        try
        {
            tokenHandler.ValidateToken(tokenEntity.Token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                /** 
                 * Définition du ClockSkew sur zéro pour que les jetons expirent exactement à l'heure d'expiration (au lieu de 5 minutes plus tard)
                 */
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);
            JwtSecurityToken jwtToken = (JwtSecurityToken) validatedToken;
            Guid userId = new Guid(jwtToken.Claims.First(x => x.Type == "id").Value);
            return tokenEntity.UserId == userId &&
                   (tokenEntity.Expired == null || tokenEntity.Expired == false) &&
                   (tokenEntity.Revoked == null || tokenEntity.Revoked == false)
               ? userId
               : null;
        }
        catch (Exception)
        {
            return null;
        }
    }

    public bool IsTokenValid(string token, Guid userId)
    {
        try
        {
            IEnumerable<Claim>? claims = GetTokenClaims(token);
            if (claims == null)
                return false;
            // Vérification de si le jeton contient l'ID d'utilisateur correspondant
            if (!claims.Any(c => c.Type == "id" && c.Value == userId.ToString()))
                return false;
            // Vérification de si le jeton est expiré
            return !IsTokenExpired(token);
        }
        catch (Exception)
        {
            return false;
        }
    }

    private bool IsTokenExpired(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadToken(token) as JwtSecurityToken;
            if (jwtToken == null || jwtToken.ValidTo < DateTime.UtcNow)
                return true;
            return false;
        }
        catch
        {
            return true;
        }
    }

    private IEnumerable<Claim>? GetTokenClaims(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadToken(token) as JwtSecurityToken;
            return jwtToken?.Claims;
        }
        catch (Exception)
        {
            return null;
        }
    }

}

