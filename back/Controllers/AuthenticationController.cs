namespace DocumentManager.Controllers;

using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DocumentManager.Models.DTO.Authentication.Request;
using DocumentManager.Services;
using DocumentManager.Helpers.Authorization;
using DocumentManager.Models.DTO.User.Response;

[ApiController]
[Route("/api/document_manager/authentication")]
public class AuthenticationController : Controller
{
    private readonly IAuthenticationService _authenticationService;
    private readonly IUserService _userService;
    private readonly IJwtUtil _jwtUtils;
    private readonly ILogger<AuthenticationController> _logger;

    public AuthenticationController(IAuthenticationService authenticationService, IUserService userService, IJwtUtil jwtUtils, ILogger<AuthenticationController> logger)
    {
        this._authenticationService = authenticationService;
        this._userService = userService;
        this._jwtUtils = jwtUtils;
        this._logger = logger;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest registerRequest)
    {
        if (!ModelState.IsValid)
        {
            List<string> errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ModelState);
        }
        return Ok(await _authenticationService.RegisterAsync(registerRequest));
    }

    [AllowAnonymous]
    [HttpPost("authenticate")]
    public async Task<IActionResult> Authenticate(LoginRequest loginRequest)
    {
        if (!ModelState.IsValid)
        {
            List<string> errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ModelState);
        }
        return Ok(await _authenticationService.LoginAsync(loginRequest));
    }

    [AllowAnonymous]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        string? token = GetBearerTokenFromRequest(Request);
        if (!string.IsNullOrEmpty(token))
        {
            await _authenticationService.LogoutAsync(token);
            return Ok();
        }
        return BadRequest("Le token d'authentification n'a pas été trouvé dans la requête.");
    }

    private string? GetBearerTokenFromRequest(HttpRequest request)
    {
        var authHeader = request.Headers["Authorization"].FirstOrDefault();
        if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
        {
            return authHeader.Substring(7);
        }

        return null;
    }

    [AllowAnonymous]
    [HttpGet("check-authentication")]
    public IActionResult CheckAuthentication()
    {
        string? token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last() ?? null;
        // Valide le jeton JWT et obtenir l'identifiant de l'utilisateur
        Guid? userId = _jwtUtils.ValidateJwtToken(token);
        bool isAuthenticated = userId != null ? true : false;
        Dictionary<string, object?> response = new Dictionary<string, object?>();
        response["is_authenticated"] = isAuthenticated;
        if (!isAuthenticated || userId == null)
        {
            if (!isAuthenticated)
            {
                response["user"] = null;
                response["message"] = "L'utilisateur n'est pas connecté";
                return Unauthorized(response);
            }
        }
        UserResponse? userResponse = null;
        if (userId != null)
        {
            userResponse = _userService.GetById(userId.Value);
        }
        response["user"] = userResponse;
        response["message"] = "L'utilisateur est connecté";
        return Ok(response);
    }

}
