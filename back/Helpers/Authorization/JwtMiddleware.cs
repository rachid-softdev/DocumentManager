namespace DocumentManager.Helpers.Authorization;

using DocumentManager.Services;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;

    public JwtMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context, IUserService userService, IJwtUtil jwtUtils)
    {
        // Récupére le jeton JWT à partir de l'en-tête "Authorization" de la requête
        string? token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
        // Valide le jeton JWT et obtenir l'identifiant de l'utilisateur
        Guid? userId = jwtUtils.ValidateJwtToken(token);
        if (userId != null)
        {
            // Attache l'utilisateur au contexte en cas de validation réussie du jeton JWT
            context.Items["User"] = userService.GetById(userId.Value);
        } else
        {
            context.Items.Remove("User");
        }
        // Passe à la requête au middleware suivant dans le pipeline
        await _next(context);
    }
}

