namespace DocumentManager.Services;

using AutoMapper;
using System.Net;
using BCrypt.Net;
using DocumentManager.Models.Entities;
using DocumentManager.Helpers;
using DocumentManager.Models.DTO.User.Request;
using DocumentManager.Models.DTO.User.Response;
using DocumentManager.Repositories;

public interface IUserService
{
    IEnumerable<UserResponse> GetAll();
    UserResponse? GetById(Guid id = new Guid());
    UserResponse? Create(UserCreateRequest userCreateRequest);
    UserResponse? UpdateById(Guid id, UserUpdateRequest userUpdateRequest);
    Task DeleteByIdAsync(Guid id = new Guid());
}

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<UserService> _logger;

    public UserService(IUserRepository userRepository, IMapper mapper, ILogger<UserService> logger)
    {
        _userRepository = userRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public IEnumerable<UserResponse> GetAll()
    {
        try
        {
            IEnumerable<UserEntity> users = _userRepository.FindAll().ToList();
            IEnumerable<UserResponse> userResponses = users.Select(user => _mapper.Map<UserResponse>(user));
            _logger.LogInformation(LogEvents.ListItems, "[UserService][GetAll] - Liste des utilisateurs récupérée avec succès.");
            return userResponses;
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[UserService][GetAll] - Une erreur s'est produite lors de la récupération de la liste des utilisateurs : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la récupération de la liste des utilisateurs.");
        }
    }

    public UserResponse? GetById(Guid id = new Guid())
    {
        try
        {
            UserEntity? user = _userRepository.FindByIdAsync(id)?.Result;
            _logger.LogInformation(LogEvents.GetItem, "[UserService][GetById] - Utilisateur avec l'identifiant {0} récupéré avec succès.", id);
            return _mapper.Map<UserResponse>(user);
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.GetItemNotFound, "[UserService][GetById] - Une erreur s'est produite lors de la récupération de l'utilisateur avec l'identifiant {0} : {1}", id, ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la récupération de l'utilisateur.");
        }
    }

    public UserResponse? Create(UserCreateRequest userCreateRequest)
    {
        try
        {
            if (_userRepository.FindAll().Any(x => x.Email == userCreateRequest.Email))
            {
                _logger.LogError(LogEvents.GetItemAlreadyExists, "[UserService][Create] - L'utilisateur avec l'adresse e-mail {0} existe déjà.", userCreateRequest.Email);
                throw new AppException((int)HttpStatusCode.BadRequest, $"L'utilisateur avec l'adresse e-mail {userCreateRequest.Email} existe déjà.");
            }
            UserEntity? userEntity = _mapper.Map<UserEntity>(userCreateRequest);
            userEntity.UserName = userEntity.Email;
            userEntity.NormalizedUserName = userEntity.Email;
            userEntity.Email = userEntity.Email;
            userEntity.NormalizedEmail = userEntity.Email;
            userEntity.PasswordHash = BCrypt.HashPassword(userCreateRequest.Password); 
            userEntity = _userRepository.SaveAsync(userEntity)?.Result;
            if (userEntity == null)
            {
                _logger.LogError(LogEvents.InsertItem, "[UserService][Create] - Une erreur est survenue lors de la création de l'utilisateur {0}.", userCreateRequest.Email);
                throw new AppException((int)HttpStatusCode.InternalServerError, $"Une erreur est survenue lors de la création de l'utilisateur {userCreateRequest.Email}.");
            }
            _logger.LogInformation(LogEvents.InsertItem, "[UserService][Create] - Utilisateur créé avec succès.");
            return _mapper.Map<UserResponse?>(userEntity);
        }
        catch (AppException ex)
        {
            _logger.LogError(LogEvents.InvalidFormatItem, "[UserService][Create] - Erreur de format invalide : {0}", ex.Message);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[UserService][Create] - Une erreur s'est produite lors de la création de l'utilisateur : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la création de l'utilisateur.");
        }
    }

    public UserResponse? UpdateById(Guid id, UserUpdateRequest userUpdateRequest)
    {
        try
        {
            UserEntity? userEntity = _userRepository.FindByIdAsync(id)?.Result;
            if (userEntity == null)
            {
                _logger.LogError(LogEvents.UpdateItemNotFound, "[UserService][UpdateById] - Aucun utilisateur trouvé avec l'identifiant {0}", id);
                throw new AppException((int)HttpStatusCode.NotFound, $"Aucun utilisateur trouvé avec l'identifiant {id}");
            }
            if (userUpdateRequest.Email != userEntity.Email && _userRepository.FindAll().Any(x => x.Email == userUpdateRequest.Email))
            {
                _logger.LogError(LogEvents.GetItemAlreadyExists, "[UserService][UpdateById] - L'utilisateur avec l'adresse e-mail {0} existe déjà.", userUpdateRequest.Email);
                throw new AppException((int)HttpStatusCode.BadRequest, $"L'utilisateur avec l'adresse e-mail {userUpdateRequest.Email} existe déjà.");
            }
            userEntity.UserName = userEntity.Email;
            userEntity.NormalizedUserName = userEntity.Email;
            userEntity.Email = userEntity.Email;
            userEntity.NormalizedEmail = userEntity.Email;
            userEntity = _userRepository.UpdateAsync(userEntity)?.Result;
            if (userEntity == null)
            {
                _logger.LogError(LogEvents.InternalError, "[UserService][UpdateById] - Une erreur est survenue lors de la mise à jour de l'utilisateur {0}.", userUpdateRequest.Email);
                throw new AppException((int)HttpStatusCode.InternalServerError, $"Une erreur est survenue lors de la mise à jour de l'utilisateur {userUpdateRequest.Email}.");
            }
            _logger.LogInformation(LogEvents.UpdateItem, "[UserService][UpdateById] - Utilisateur mis à jour avec succès.");
            return _mapper.Map<UserResponse?>(userEntity);
        }
        catch (AppException ex)
        {
            _logger.LogError(LogEvents.InvalidFormatItem, "[UserService][UpdateById] - Erreur de format invalide : {0}", ex.Message);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[UserService][UpdateById] - Une erreur s'est produite lors de la mise à jour de l'utilisateur : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la mise à jour de l'utilisateur.");
        }
    }

    public async Task DeleteByIdAsync(Guid id = new Guid())
    {
        try
        {
            UserEntity? userEntity = await _userRepository.FindByIdAsync(id);
            if (userEntity == null)
            {
                _logger.LogError(LogEvents.GetItemNotFound, "[UserService][DeleteById] - Aucun utilisateur trouvé avec l'identifiant {0}", id);
                throw new AppException((int)HttpStatusCode.NotFound, $"Aucun utilisateur trouvé avec l'identifiant {id}");
            }
            await _userRepository.DeleteByIdAsync(id);
            _logger.LogInformation(LogEvents.DeleteItem, "[UserService][DeleteById] - Utilisateur supprimé avec succès.");
        }
        catch (AppException ex)
        {
            _logger.LogError(LogEvents.GetItemNotFound, "[UserService][DeleteById] - Erreur de format invalide : {0}", ex.Message);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[UserService][DeleteById] - Une erreur s'est produite lors de la suppression de l'utilisateur : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la suppression de l'utilisateur.");
        }
    }
}
