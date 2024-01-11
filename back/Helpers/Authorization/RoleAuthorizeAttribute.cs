namespace DocumentManager.Helpers.Authorization;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using DocumentManager.Models.DTO.User.Response;
using DocumentManager.Models.Entities;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
public class RoleAuthorizeAttribute : Attribute, IAuthorizationFilter
{
    private readonly Role[] _roles;

    public RoleAuthorizeAttribute(params Role[] roles)
    {
        _roles = roles;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        // Ignore l'autorisation si l'action est décorée avec l'attribut [AllowAnonymous]
        var allowAnonymous = context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any();
        if (allowAnonymous)
            return;
        // Authorization
        UserResponse? user = (UserResponse?) context.HttpContext.Items["User"];
        if (user == null || !IsUserInRoles(user, _roles))
        {
            context.Result = new JsonResult(new { status = StatusCodes.Status401Unauthorized, message = "Unauthorized" }) { StatusCode = StatusCodes.Status401Unauthorized };
        }
    }

    private bool IsUserInRoles(UserResponse user, Role[] roles)
    {
        return roles.Any(role => user.Roles.Any(userRole => userRole.Name == role.ToString()));
    }
}
