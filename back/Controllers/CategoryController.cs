namespace DocumentManager.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DocumentManager.Models.DTO.Category.Request;
using DocumentManager.Models.DTO.Category.Response;
using DocumentManager.Services;
using DocumentManager.Helpers.Authorization;

[ApiController]
[Route("/api/document_manager/categories")]
public class CategoryController : Controller
{
    private readonly ICategoryService _categoryService;

    public CategoryController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpGet]
    public ActionResult<IEnumerable<CategoryResponse>> GetAll()
    {
        IEnumerable<CategoryResponse> documents = _categoryService.GetAll();
        return Ok(documents);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpGet("{id}")]
    public ActionResult<CategoryResponse> GetById(Guid id)
    {
        CategoryResponse? category = _categoryService.GetById(id);
        return category == null ?
            NotFound(String.Format("Aucune catégorie n'a été trouvé pour l'identifiant {0}", id))
            : Ok(category);
    }

    [RoleAuthorizeAttribute(Role.Administrator)]
    [HttpPost]
    public ActionResult<CategoryResponse> Create([FromBody] CategoryCreateRequest categoryCreateRequest)
    {
        if (!ModelState.IsValid)
        {
            List<string> errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            return this.BadRequest(ModelState);
        }
        CategoryResponse? categoryResponse = _categoryService.Create(categoryCreateRequest);
        return Created("URI", categoryResponse);
    }

    [RoleAuthorizeAttribute(Role.Administrator)]
    [HttpPut("{id:guid}")]
    public ActionResult<CategoryResponse> UpdateById(Guid id, [FromBody] CategoryUpdateRequest categoryUpdateRequest)
    {
        if (!ModelState.IsValid)
        {
            return this.BadRequest(ModelState);
        }
        CategoryResponse? categoryResponse = _categoryService.UpdateById(id, categoryUpdateRequest);
        return Created("URI", categoryResponse);
    }

    [RoleAuthorizeAttribute(Role.Administrator)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteById(Guid id)
    {
        // Utilisation de l'async sur le controller, service, repository car la récursivité sur les catégories/sous-catégories est chargé 
        CategoryResponse? category = _categoryService.GetById(id);
        if (category == null) NotFound(String.Format("Aucun catégorie trouvé pour l'identifiant %d", id));
        await _categoryService.DeleteById(id);
        return Ok(new { message = String.Format("La catégorie {0} a été supprimée", id) });
    }
}
