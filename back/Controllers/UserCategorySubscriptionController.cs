namespace DocumentManager.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DocumentManager.Models.DTO.UserCategorySubscription.Request;
using DocumentManager.Models.DTO.UserCategorySubscription.Response;
using DocumentManager.Models.DTO.User.Response;
using DocumentManager.Models.DTO.Category.Response;
using DocumentManager.Services;
using DocumentManager.Helpers.Authorization;

[ApiController]
[Route("/api/document_manager/users-categories-subscriptions")]
public class UserCategorySubscriptionController : Controller
{
    private readonly IUserCategorySubscriptionService _userCategorySubscriptionService;

    public UserCategorySubscriptionController(IUserCategorySubscriptionService userCategorySubscriptionService)
    {
        _userCategorySubscriptionService = userCategorySubscriptionService;
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpGet]
    public ActionResult<IEnumerable<UserCategorySubscriptionResponse>> GetAll()
    {
        IEnumerable<UserCategorySubscriptionResponse> usersCategoriesSubscriptions = _userCategorySubscriptionService.GetAll();
        return Ok(usersCategoriesSubscriptions);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpGet("{userId}/{categoryId}")]
    public ActionResult<UserCategorySubscriptionResponse> GetByIds(Guid userId = new Guid(), Guid categoryId = new Guid())
    {
        UserCategorySubscriptionResponse? userCategorySubscription = _userCategorySubscriptionService.GetByIds(userId, categoryId);
        return userCategorySubscription == null ?
                NotFound(String.Format("Aucune user-catégorie-subscription trouvé avec l'identifiant de l'utilisateur {0} et de la catégorie {1}", userId, categoryId))
                : Ok(userCategorySubscription);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpGet("user/{userId}")]
    public ActionResult<UserCategorySubscriptionResponse> GetAllByUserId(Guid userId = new Guid())
    {
        IEnumerable<UserCategorySubscriptionResponse> usersCategoriesSubscriptions = _userCategorySubscriptionService.GetAllByUserId(userId);
        return Ok(usersCategoriesSubscriptions);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpGet("category/{categoryId}")]
    public ActionResult<UserCategorySubscriptionResponse> GetAllByCategoryId(Guid categoryId = new Guid())
    {
        IEnumerable<UserCategorySubscriptionResponse> usersCategoriesSubscriptions = _userCategorySubscriptionService.GetAllByCategoryId(categoryId);
        return Ok(usersCategoriesSubscriptions);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpGet("{userId}/categories")]
    public ActionResult<IEnumerable<BaseCategoryResponse>> GetAllCategoriesByUserId(Guid userId = new Guid())
    {
        IEnumerable<UserCategorySubscriptionResponse> usersCategoriesSubscriptions = _userCategorySubscriptionService.GetAllByUserId(userId);
        IEnumerable<BaseCategoryResponse?> categories = usersCategoriesSubscriptions.Select(ucs => ucs.Category);
        return Ok(categories);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpGet("{categoryId}/users")]
    public ActionResult<IEnumerable<BaseUserResponse>> GetAllUsersByCategoryId(Guid categoryId = new Guid())
    {
        IEnumerable<UserCategorySubscriptionResponse> usersCategoriesSubscriptions = _userCategorySubscriptionService.GetAllByCategoryId(categoryId);
        IEnumerable<BaseUserResponse?> users = usersCategoriesSubscriptions.Select(ucs => ucs.User);
        return Ok(users);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpPost]
    public ActionResult<UserCategorySubscriptionResponse> Create([FromBody] UserCategorySubscriptionCreateRequest userCategorySubscriptionCreateRequest)
    {
        if (!ModelState.IsValid)
        {
            List<string> errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
            return this.BadRequest(ModelState);
        }
        UserCategorySubscriptionResponse? userCategorySubscriptionResponse = _userCategorySubscriptionService.Create(userCategorySubscriptionCreateRequest);
        return Created("URI", userCategorySubscriptionResponse);
    }

    [RoleAuthorizeAttribute(Role.Administrator, Role.User)]
    [HttpDelete("{userId}/{categoryId}")]
    public async Task<IActionResult> DeleteByIds(Guid userId = new Guid(), Guid categoryId = new Guid())
    {
        UserCategorySubscriptionResponse? userCategorySubscriptionResponse = _userCategorySubscriptionService.GetByIds(userId, categoryId);
        if (userCategorySubscriptionResponse == null) NotFound(String.Format("Aucune user-catégorie-subscription trouvé avec l'identifiant de l'utilisateur {0} et de la catégorie {1}", userId, categoryId));
        await _userCategorySubscriptionService.DeleteByIds(userId, categoryId);
        return Ok(new { message = String.Format("La liaison de l'utilisateur {0} avec la catégorie {1} subscription a été supprimée", userId, categoryId) });
    }
}
