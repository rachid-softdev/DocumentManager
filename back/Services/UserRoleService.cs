namespace DocumentManager.Services;

using AutoMapper;
using System.Net;
using DocumentManager.Models.Entities;
using DocumentManager.Helpers;
using DocumentManager.Repositories;
using DocumentManager.Services;
using DocumentManager.Models.DTO.User.Response;
using DocumentManager.Models.DTO.UserRole.Response;

public interface IUserRoleService
{
    IEnumerable<UserRoleResponse> GetAll();
}

public class UserRoleService : IUserRoleService
{
    private readonly IUserRoleRepository _userRoleRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<UserRoleService> _logger;

    public UserRoleService(IUserRoleRepository userRoleRepository, IMapper mapper, ILogger<UserRoleService> logger)
    {
        _userRoleRepository = userRoleRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public IEnumerable<UserRoleResponse> GetAll()
    {
        try
        {
            IEnumerable<UserRoleEntity> userRoles = _userRoleRepository.FindAll().ToList();
            IEnumerable<UserRoleResponse> userResponses = userRoles.Select(user => _mapper.Map<UserRoleResponse>(user));
            _logger.LogInformation(LogEvents.ListItems, "[UserRoleService][GetAll] - Liste des rôles d'utilisateurs récupérée avec succès.");
            return userResponses;
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[UserRoleService][GetAll] - Une erreur s'est produite lors de la récupération de la liste des rôles d'utilisateurs : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la récupération de la liste des rôles d'utilisateurs.");
        }
    }
}