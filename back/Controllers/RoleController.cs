namespace DocumentManager.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DocumentManager.Services;
using DocumentManager.Models.DTO.Role.Response;
using DocumentManager.Models.DTO.Role.Request;
using DocumentManager.Helpers.Authorization;

[ApiController]
[Route("/api/document_manager/roles")]
public class RoleController : ControllerBase
{
    private IRoleService _roleService;

    public RoleController(IRoleService roleService)
    {
        _roleService = roleService;
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpGet]
    public IActionResult GetAll()
    {
        IEnumerable<RoleResponse> roles = _roleService.GetAll();
        return Ok(roles);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        RoleResponse? role = _roleService.GetById(id);
        return role == null ?
            NotFound(String.Format("Aucun rôle trouvé pour l'identifiant {0}", id))
            : Ok(role);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpPost]
    public IActionResult Create([FromBody] RoleCreateRequest roleCreateRequest)
    {
        if (!ModelState.IsValid)
        {
            List<string> errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ModelState);
        }
        RoleResponse? role = _roleService.Create(roleCreateRequest);
        return Ok(role);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpPut("{id:guid}")]
    public IActionResult UpdateById([FromRoute] Guid id, [FromBody] RoleUpdateRequest roleUpdateRequest)
    {
        if (!ModelState.IsValid)
        {
            List<string> errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return BadRequest(ModelState);
        }
        RoleResponse? role = _roleService.UpdateById(id, roleUpdateRequest);
        return Ok(role);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpDelete("{id}")]
    public IActionResult DeleteById(Guid id)
    {
        RoleResponse? role = _roleService.GetById(id);
        if (role == null) NotFound(String.Format("Aucun rôle trouvé pour l'identifiant %d", id));
        _roleService.DeleteById(id);
        return Ok(new { message = String.Format("Le rôle {0} a été supprimé", id) });
    }
}