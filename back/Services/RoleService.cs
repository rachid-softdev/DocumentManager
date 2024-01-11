namespace DocumentManager.Services;

using AutoMapper;
using System.Net;
using DocumentManager.Models.Entities;
using DocumentManager.Helpers;
using DocumentManager.Repositories;
using DocumentManager.Models.DTO.Role.Response;
using DocumentManager.Models.DTO.Role.Request;

public interface IRoleService
{
    IEnumerable<RoleResponse> GetAll();
    RoleResponse? GetById(Guid id = new Guid());
    RoleResponse? Create(RoleCreateRequest roleCreateRequest);
    RoleResponse? UpdateById(Guid id, RoleUpdateRequest roleUpdateRequest);
    Task DeleteById(Guid id = new Guid());
}

public class RoleService : IRoleService
{
    private readonly IRoleRepository _roleRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<RoleService> _logger;

    public RoleService(IRoleRepository roleRepository, IMapper mapper, ILogger<RoleService> logger)
    {
        _roleRepository = roleRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public IEnumerable<RoleResponse> GetAll()
    {
        try
        {
            IEnumerable<RoleEntity> roles = _roleRepository.FindAll().ToList();
            IEnumerable<RoleResponse> roleResponses = roles.Select(role => _mapper.Map<RoleResponse>(role));
            _logger.LogInformation(LogEvents.ListItems, "[RoleService][GetAll] - Roles récupérés avec succès.");
            return roleResponses;
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[RoleService][GetAll] - Erreur lors de la récupération des rôles : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Erreur lors de la récupération des rôles.");
        }
    }

    public RoleResponse? GetById(Guid id = new Guid())
    {
        try
        {
            RoleEntity? role = _roleRepository.FindById(id)?.Result;
            return _mapper.Map<RoleResponse>(role);
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.GetItemNotFound, "[RoleService][GetById] - Erreur lors de la récupération du rôle avec l'identifiant {0} : {1}", id, ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, $"Aucun rôle trouvé avec l'identifiant {id}.");
        }
    }

    public RoleResponse? Create(RoleCreateRequest roleCreateRequest)
    {
        try
        {
            if (_roleRepository.FindAll().Any(x => x.Name == roleCreateRequest.Name))
            {
                _logger.LogError(LogEvents.GetItemAlreadyExists, "[RoleService][Create] - Le rôle {0} existe déjà.", roleCreateRequest.Name);
                throw new AppException((int)HttpStatusCode.Conflict, String.Format("Le rôle {0} existe déjà.", roleCreateRequest.Name));
            }
            RoleEntity? roleEntity = _mapper.Map<RoleEntity>(roleCreateRequest);
            roleEntity = _roleRepository.Save(roleEntity)?.Result;
            _logger.LogInformation(LogEvents.InsertItem, "[RoleService][Create] - Rôle créé avec succès.");
            return _mapper.Map<RoleResponse?>(roleEntity);
        }
        catch (AppException ex)
        {
            _logger.LogError(LogEvents.GetItemAlreadyExists, "[RoleService][Create] - Erreur d'élément existant : {0}", ex.Message);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[RoleService][Create] - Une erreur s'est produite lors de la création du rôle : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la création du rôle.");
        }
    }

    public RoleResponse? UpdateById(Guid id, RoleUpdateRequest roleUpdateRequest)
    {
        try
        {
            RoleEntity? roleEntity = _roleRepository.FindById(id)?.Result;
            if (roleEntity == null)
            {
                _logger.LogError(LogEvents.GetItemNotFound, "[RoleService][UpdateById] - Aucun rôle trouvé avec l'identifiant {0}", id);
                throw new AppException((int)HttpStatusCode.NotFound, String.Format("Aucun rôle trouvé avec l'identifiant {0}", id));
            }
            if (roleUpdateRequest.Name != roleEntity.Name && _roleRepository.FindAll().Any(x => x.Name == roleUpdateRequest.Name))
            {
                _logger.LogError(LogEvents.GetItemAlreadyExists, "[RoleService][UpdateById] - Le rôle avec le nom {0} existe déjà.", roleUpdateRequest.Name);
                throw new AppException((int)HttpStatusCode.Conflict, String.Format("Le rôle avec le nom {0} existe déjà.", roleUpdateRequest.Name));
            }
            roleEntity = _roleRepository.Update(roleEntity)?.Result;
            _logger.LogInformation(LogEvents.UpdateItem, "[RoleService][UpdateById] - Rôle mis à jour avec succès.");
            return _mapper.Map<RoleResponse?>(roleEntity);
        }
        catch (AppException ex)
        {
            _logger.LogError(LogEvents.GetItemNotFound, "[RoleService][UpdateById] - Erreur d'élément non trouvé : {0}", ex.Message);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[RoleService][UpdateById] - Une erreur s'est produite lors de la mise à jour du rôle : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la mise à jour du rôle.");
        }
    }

    public Task DeleteById(Guid id = new Guid())
    {
        try
        {
            RoleEntity? roleEntity = _roleRepository.FindById(id)?.Result;
            if (roleEntity == null)
            {
                _logger.LogError(LogEvents.GetItemNotFound, "[RoleService][DeleteById] - Aucun rôle trouvé avec l'identifiant {0}", id);
                throw new AppException((int)HttpStatusCode.NotFound, String.Format("Aucun rôle trouvé avec l'identifiant {0}", id));
            }
            _logger.LogInformation(LogEvents.DeleteItem, "[RoleService][DeleteById] - Rôle supprimé avec succès.");
            return _roleRepository.DeleteById(id);
        }
        catch (AppException ex)
        {
            _logger.LogError(LogEvents.GetItemNotFound, "[RoleService][DeleteById] - Erreur d'élément non trouvé : {0}", ex.Message);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[RoleService][DeleteById] - Une erreur s'est produite lors de la suppression du rôle : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la suppression du rôle.");
        }
    }
}
