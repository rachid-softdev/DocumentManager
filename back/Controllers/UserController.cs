namespace DocumentManager.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DocumentManager.Models.DTO.User.Request;
using DocumentManager.Models.DTO.User.Response;
using DocumentManager.Services;
using DocumentManager.Helpers.Authorization;

[ApiController]
[Route("/api/document_manager/users")]
public class UserController : ControllerBase
{
    private IUserService _userService;

    public UserController(
        IUserService userService)
    {
        _userService = userService;
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpGet]
    public IActionResult GetAll()
    {
        IEnumerable<UserResponse> users = _userService.GetAll();
        return Ok(users);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        UserResponse? user = _userService.GetById(id);
        return user == null ?
            NotFound(String.Format("Aucun utilisateur trouvé pour l'identifiant {0}", id))
            : Ok(user);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpPost]
    public IActionResult Create([FromBody] UserCreateRequest userCreateRequest)
    {
        if (!ModelState.IsValid)
        {
            List<string> errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ModelState);
        }
        UserResponse? user = _userService.Create(userCreateRequest);
        return Ok(user);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpPut("{id:guid}")]
    public IActionResult UpdateById([FromRoute] Guid id, [FromBody] UserUpdateRequest userUpdateRequest)
    {
        if (!ModelState.IsValid)
        {
            List<string> errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ModelState);
        }
        UserResponse? user = _userService.UpdateById(id, userUpdateRequest);
        return Ok(user);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteById(Guid id)
    {
        UserResponse? user = _userService.GetById(id);
        if (user == null) NotFound(String.Format("Aucun utilisateur trouvé pour l'identifiant %d", id));
        await _userService.DeleteByIdAsync(id);
        return Ok(new { message = String.Format("L'utilisateur {0} a été supprimé", id) });
    }
}