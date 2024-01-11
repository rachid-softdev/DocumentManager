namespace DocumentManager.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DocumentManager.Services;
using DocumentManager.Models.DTO.UserRole.Response;
using DocumentManager.Helpers.Authorization;

// using DocumentManager.Models.DTO.UserRole.Response;
// using DocumentManager.Models.DTO.UserRole.Request;

[ApiController]
[Route("/api/document_manager/user-role")]
public class UserRoleController : ControllerBase
{
	private IUserRoleService _userRoleService;

	public UserRoleController(IUserRoleService userRoleService)
	{
		_userRoleService = userRoleService;
	}

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpGet]
	public IActionResult GetAll()
	{
		IEnumerable<UserRoleResponse> roles = _userRoleService.GetAll();
		return Ok(roles);
	}
}