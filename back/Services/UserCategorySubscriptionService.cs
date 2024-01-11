namespace DocumentManager.Services;

using AutoMapper;
using System.Net;
using DocumentManager.Models.Entities;
using DocumentManager.Helpers;
using DocumentManager.Models.DTO.UserCategorySubscription.Request;
using DocumentManager.Models.DTO.UserCategorySubscription.Response;
using DocumentManager.Repositories;

public interface IUserCategorySubscriptionService
{
    IEnumerable<UserCategorySubscriptionResponse> GetAll();
    IEnumerable<UserCategorySubscriptionResponse> GetAllByUserId(Guid userId = new Guid());
    IEnumerable<UserCategorySubscriptionResponse> GetAllByCategoryId(Guid categoryId = new Guid());
    UserCategorySubscriptionResponse? GetByIds(Guid userId = new Guid(), Guid categoryId = new Guid());
    UserCategorySubscriptionResponse? Create(UserCategorySubscriptionCreateRequest userCategorySubscriptionCreateRequest);
    Task DeleteByIds(Guid userId = new Guid(), Guid categoryId = new Guid());
}

/**
 * pas de await async à la chaine comme sur les repo car c la méthode du dessus qui apelle direct
*/

public class UserCategorySubscriptionService : IUserCategorySubscriptionService
{
    private readonly IUserCategorySubscriptionRepository _userCategorySubscriptionRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<UserCategorySubscriptionService> _logger;

    public UserCategorySubscriptionService(
        IUserCategorySubscriptionRepository userCategorySubscriptionRepository,
        IUserRepository userRepository,
        ICategoryRepository categoryRepository,
        IMapper mapper,
        ILogger<UserCategorySubscriptionService> logger)
    {
        _userCategorySubscriptionRepository = userCategorySubscriptionRepository;
        _userRepository = userRepository;
        _categoryRepository = categoryRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public IEnumerable<UserCategorySubscriptionResponse> GetAll()
    {
        try
        {
            IEnumerable<UserCategorySubscriptionEntity> userCategorySubscriptionEntities = _userCategorySubscriptionRepository.FindAll().ToList();
            IEnumerable<UserCategorySubscriptionResponse> userCategorySubscriptionResponses = _mapper.Map<IEnumerable<UserCategorySubscriptionResponse>>(userCategorySubscriptionEntities);
            _logger.LogInformation(LogEvents.ListItems, "[UserCategorySubscriptionService][GetAll] - Liste des abonnements aux catégories récupérée avec succès.");
            return userCategorySubscriptionResponses;
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[UserCategorySubscriptionService][GetAll] - Une erreur s'est produite lors de la récupération des abonnements aux catégories : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la récupération des abonnements aux catégories.");
        }
    }

    public IEnumerable<UserCategorySubscriptionResponse> GetAllByUserId(Guid userId = new Guid())
    {
        try
        {
            IEnumerable<UserCategorySubscriptionEntity> userCategorySubscriptionEntities = _userCategorySubscriptionRepository.FindAllByUserId(userId).ToList();
            IEnumerable<UserCategorySubscriptionResponse> userCategorySubscriptionResponses = _mapper.Map<IEnumerable<UserCategorySubscriptionResponse>>(userCategorySubscriptionEntities);
            _logger.LogInformation(LogEvents.ListItems, "[UserCategorySubscriptionService][GetAllByUserId] - Liste des abonnements aux catégories pour l'utilisateur {0} récupérée avec succès.", userId);
            return userCategorySubscriptionResponses;
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[UserCategorySubscriptionService][GetAllByUserId] - Une erreur s'est produite lors de la récupération des abonnements aux catégories pour l'utilisateur {0} : {1}", userId, ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la récupération des abonnements aux catégories pour l'utilisateur.");
        }
    }

    public IEnumerable<UserCategorySubscriptionResponse> GetAllByCategoryId(Guid categoryId = new Guid())
    {
        try
        {
            IEnumerable<UserCategorySubscriptionEntity> userCategorySubscriptionEntities = _userCategorySubscriptionRepository.FindAllByCategoryId(categoryId).ToList();
            IEnumerable<UserCategorySubscriptionResponse> userCategorySubscriptionResponses = _mapper.Map<IEnumerable<UserCategorySubscriptionResponse>>(userCategorySubscriptionEntities);
            _logger.LogInformation(LogEvents.ListItems, "[UserCategorySubscriptionService][GetAllByCategoryId] - Liste des abonnements aux catégories pour la catégorie {0} récupérée avec succès.", categoryId);
            return userCategorySubscriptionResponses;
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[UserCategorySubscriptionService][GetAllByCategoryId] - Une erreur s'est produite lors de la récupération des abonnements aux catégories pour la catégorie {0} : {1}", categoryId, ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la récupération des abonnements aux catégories pour la catégorie.");
        }
    }

    public UserCategorySubscriptionResponse? GetByIds(Guid userId = new Guid(), Guid categoryId = new Guid())
    {
        try
        {
            UserCategorySubscriptionEntity? userCategorySubscriptionEntity = _userCategorySubscriptionRepository.FindByIds(userId, categoryId)?.Result;
            UserCategorySubscriptionResponse userCategorySubscriptionResponse = _mapper.Map<UserCategorySubscriptionResponse>(userCategorySubscriptionEntity);
            _logger.LogInformation(LogEvents.GetItem, "[UserCategorySubscriptionService][GetByIds] - Abonnement aux catégories pour l'utilisateur {0} et la catégorie {1} récupéré avec succès.", userId, categoryId);
            return userCategorySubscriptionResponse;
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.GetItemNotFound, "[UserCategorySubscriptionService][GetByIds] - Une erreur s'est produite lors de la récupération de l'abonnement aux catégories pour l'utilisateur {0} et la catégorie {1} : {2}", userId, categoryId, ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la récupération de l'abonnement aux catégories pour l'utilisateur et la catégorie spécifiés.");
        }
    }

    public UserCategorySubscriptionResponse? Create(UserCategorySubscriptionCreateRequest userCategorySubscriptionCreateRequest)
    {
        try
        {
            string? userId = userCategorySubscriptionCreateRequest.User?.Id ?? null;
            string? categoryId = userCategorySubscriptionCreateRequest.Category?.Id ?? null;
            if (userId == null || categoryId == null)
            {
                _logger.LogError(LogEvents.InvalidFormatItem, "[UserCategorySubscriptionService][Create] - L'utilisateur ou la catégorie spécifiée n'existe pas.");
                throw new AppException((int)HttpStatusCode.NotFound, "L'utilisateur ou la catégorie spécifiée n'existe pas.");
            }
            UserEntity? userEntity = _userRepository.FindByIdAsync(Guid.Parse(userId))?.Result;
            CategoryEntity? categoryEntity = _categoryRepository.FindById(Guid.Parse(categoryId))?.Result;
            if (userEntity == null)
            {
                _logger.LogError(LogEvents.GetItemNotFound, "[UserCategorySubscriptionService][Create] - L'utilisateur {0} spécifié n'existe pas.", userId);
                throw new AppException((int)HttpStatusCode.NotFound, String.Format("L'utilisateur {0} spécifié n'existe pas.", userId));
            }
            if (categoryEntity == null)
            {
                _logger.LogError(LogEvents.GetItemNotFound, "[UserCategorySubscriptionService][Create] - La catégorie {0} spécifiée n'existe pas.", categoryId);
                throw new AppException((int)HttpStatusCode.NotFound, String.Format("La catégorie {0} spécifiée n'existe pas.", categoryId));
            }
            if (this.GetByIds(userEntity.Id, categoryEntity.Id) != null)
            {
                _logger.LogError(LogEvents.GetItemAlreadyExists, "[UserCategorySubscriptionService][Create] - La liaison de l'utilisateur {0} avec la catégorie {1} existe déjà.", userId, categoryId);
                throw new AppException((int)HttpStatusCode.Conflict, String.Format("La liaison de l'utilisateur {0} avec la catégorie {1} existe déjà.", userId, categoryId));
            }
            UserCategorySubscriptionEntity? userCategorySubscriptionEntity = new UserCategorySubscriptionEntity
            {
                UserId = userEntity.Id,
                CategoryId = categoryEntity.Id
            };
            userCategorySubscriptionEntity = _userCategorySubscriptionRepository.Save(userCategorySubscriptionEntity)?.Result;
            _logger.LogInformation(LogEvents.InsertItem, "[UserCategorySubscriptionService][Create] - Abonnement aux catégories créé avec succès.");
            return _mapper.Map<UserCategorySubscriptionResponse?>(userCategorySubscriptionEntity);
        }
        catch (AppException ex)
        {
            _logger.LogError(LogEvents.InvalidFormatItem, "[UserCategorySubscriptionService][Create] - Erreur de format invalide : {0}", ex.Message);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[UserCategorySubscriptionService][Create] - Une erreur s'est produite lors de la création de l'abonnement aux catégories : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la création de l'abonnement aux catégories.");
        }
    }

    public async Task DeleteByIds(Guid userId = new Guid(), Guid categoryId = new Guid())
    {
        try
        {
            UserCategorySubscriptionEntity? userCategorySubscriptionEntity = _userCategorySubscriptionRepository.FindByIds(userId, categoryId)?.Result;
            if (userCategorySubscriptionEntity == null)
            {
                _logger.LogError(LogEvents.GetItemNotFound, "[UserCategorySubscriptionService][DeleteByIds] - Aucun utilisateur-catégorie trouvé avec l'identifiant de l'utilisateur {0} et de document {1}", userId, categoryId);
                throw new AppException((int)HttpStatusCode.NotFound, String.Format("Aucun utilisateur-catégorie trouvé avec l'identifiant de l'utilisateur {0} et de document {1}", userId, categoryId));
            }
            _logger.LogInformation(LogEvents.DeleteItem, "[UserCategorySubscriptionService][DeleteByIds] - Abonnement aux catégories supprimé avec succès pour l'utilisateur {0} et la catégorie {1}", userId, categoryId);
            await _userCategorySubscriptionRepository.DeleteByIds(userId, categoryId);
        }
        catch (AppException ex)
        {
            _logger.LogError(LogEvents.GetItemNotFound, "[UserCategorySubscriptionService][DeleteByIds] - Erreur : {0}", ex.Message);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[UserCategorySubscriptionService][DeleteByIds] - Une erreur s'est produite lors de la suppression de l'abonnement aux catégories : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la suppression de l'abonnement aux catégories.");
        }
    }

}
