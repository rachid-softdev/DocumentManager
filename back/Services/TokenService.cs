namespace DocumentManager.Services;

using System.Net;
using DocumentManager.Helpers;
using DocumentManager.Models.Entities;
using DocumentManager.Repositories;

public interface ITokenService
{
    IEnumerable<TokenEntity> GetAll();
    IEnumerable<TokenEntity> GetAllByUserId(Guid userId = new Guid());
    IEnumerable<TokenEntity> GetAllValidByUserId(Guid userId = new Guid());
    TokenEntity? GetById(Guid id = new Guid());
    Task<TokenEntity?> GetByTokenAsync(string token = "");
    Task<TokenEntity?> CreateAsync(TokenEntity tokenEntity);
    Task<TokenEntity?> UpdateAsync(TokenEntity? tokenEntity);
    Task DeleteByIdAsync(Guid id = new Guid());
    Task DeleteAllAsync();
    Task DeleteAllByUserIdAsync(Guid userId = new Guid());
}

public class TokenService : ITokenService
{
    private readonly ITokenRepository _tokenRepository;
    private readonly ILogger<TokenService> _logger;

    public TokenService(ITokenRepository tokenRepository, ILogger<TokenService> logger)
    {
        _tokenRepository = tokenRepository;
        _logger = logger;
    }

    public IEnumerable<TokenEntity> GetAll()
    {
        try
        {
            IEnumerable<TokenEntity> tokens = _tokenRepository.FindAll().ToList();
            _logger.LogInformation(LogEvents.ListItems, "[TokenService][GetAllTokens] - Liste des tokens récupérée avec succès.");
            return tokens;
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[TokenService][GetAllTokens] - Une erreur s'est produite lors de la récupération de la liste des tokens : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la récupération de la liste des tokens.");
        }
    }

    public IEnumerable<TokenEntity> GetAllByUserId(Guid userId = new Guid())
    {
        try
        {
            IEnumerable<TokenEntity> tokens = _tokenRepository.FindAllByUserId(userId).ToList();
            _logger.LogInformation(LogEvents.ListItems, "[TokenService][GetTokensByUserId] - Liste des tokens pour l'utilisateur avec l'ID {0} récupérée avec succès.", userId);
            return tokens;
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[TokenService][GetTokensByUserId] - Une erreur s'est produite lors de la récupération de la liste des tokens pour l'utilisateur avec l'ID {0} : {1}", userId, ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la récupération de la liste des tokens pour l'utilisateur.");
        }
    }

    public IEnumerable<TokenEntity> GetAllValidByUserId(Guid userId = new Guid())
    {
        try
        {
            IEnumerable<TokenEntity> validTokens = _tokenRepository.FindAllValidByUserId(userId).ToList();
            _logger.LogInformation(LogEvents.ListItems, "[TokenService][GetAllValidByUserId] - Liste des tokens valides pour l'utilisateur avec l'ID {0} récupérée avec succès.", userId);
            return validTokens;
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[TokenService][GetAllValidByUserId] - Une erreur s'est produite lors de la récupération des tokens valides pour l'utilisateur avec l'ID {0} : {1}", userId, ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la récupération des tokens valides pour l'utilisateur.");
        }
    }

    public TokenEntity? GetById(Guid id = new Guid())
    {
        try
        {
            TokenEntity? tokenEntity = _tokenRepository.FindByIdAsync(id)?.Result;
            if (tokenEntity == null)
            {
                _logger.LogError(LogEvents.GetItemNotFound, "[TokenService][GetById] - Aucun token trouvé avec l'identifiant {0}.", id);
                throw new AppException((int)HttpStatusCode.NotFound, $"Aucun token trouvé avec l'identifiant {id}.");
            }
            _logger.LogInformation(LogEvents.GetItem, "[TokenService][GetById] - Token récupéré avec succès.");
            return tokenEntity;
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[TokenService][GetById] - Une erreur s'est produite lors de la récupération du token : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la récupération du token.");
        }
    }

    public async Task<TokenEntity?> GetByTokenAsync(string token = "")
    {
        try
        {
            TokenEntity? tokenEntity = await _tokenRepository.FindByTokenAsync(token);
            if (tokenEntity == null)
            {
                _logger.LogError(LogEvents.GetItemNotFound, "[TokenService][GetByTokenAsync] - Aucun token trouvé avec le token {0}.", token);
                throw new AppException((int)HttpStatusCode.NotFound, $"Aucun token trouvé avec le token {token}.");
            }
            _logger.LogInformation(LogEvents.GetItem, "[TokenService][GetByTokenAsync] - Token récupéré avec succès.");
            return tokenEntity;
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[TokenService][GetByTokenAsync] - Une erreur s'est produite lors de la récupération du token : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la récupération du token.");
        }
    }

    public async Task<TokenEntity?> CreateAsync(TokenEntity tokenEntity)
    {
        try
        {
            TokenEntity? tokenResult = await _tokenRepository.SaveAsync(tokenEntity);
            _logger.LogInformation(LogEvents.InsertItem, "[TokenService][Create] - Token créé avec succès.");
            return tokenResult;
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[TokenService][Create] - Une erreur s'est produite lors de la création du token : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la création du token.");
        }
    }

    public async Task<TokenEntity?> UpdateAsync(TokenEntity? tokenEntity)
    {
        try
        {
            TokenEntity? existingToken = await _tokenRepository.FindByIdAsync(tokenEntity?.Id ?? Guid.Empty);
            if (existingToken == null)
            {
                _logger.LogError(LogEvents.UpdateItemNotFound, "[TokenService][UpdateAsync] - Aucun token trouvé pour la mise à jour.");
                throw new AppException((int)HttpStatusCode.NotFound, "Aucun token trouvé pour la mise à jour.");
            }
            TokenEntity? updatedToken = await _tokenRepository.UpdateAsync(tokenEntity);
            _logger.LogInformation(LogEvents.UpdateItem, "[TokenService][UpdateAsync] - Token mis à jour avec succès.");
            return updatedToken;
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[TokenService][UpdateAsync] - Une erreur s'est produite lors de la mise à jour du token : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la mise à jour du token.");
        }
    }

    public async Task DeleteByIdAsync(Guid id = new Guid())
    {
        try
        {
            TokenEntity? tokenEntity = await _tokenRepository.FindByIdAsync(id);
            if (tokenEntity == null)
            {
                _logger.LogError(LogEvents.GetItemNotFound, "[TokenService][DeleteById] - Aucun token trouvé avec l'identifiant {0}", id);
                throw new AppException((int)HttpStatusCode.NotFound, $"Aucun token trouvé avec l'identifiant {id}");
            }
            await _tokenRepository.DeleteByIdAsync(id);
            _logger.LogInformation(LogEvents.DeleteItem, "[TokenService][DeleteById] - Token supprimé avec succès.");
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[TokenService][DeleteById] - Une erreur s'est produite lors de la suppression du token : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la suppression du token.");
        }
    }

    public async Task DeleteAllByUserIdAsync(Guid userId = new Guid())
    {
        try
        {
            await _tokenRepository.DeleteAllByUserIdAsync(userId);
            _logger.LogInformation(LogEvents.DeleteItem, "[TokenService][DeleteAllByUserIdAsync] - Tous les tokens pour l'utilisateur avec l'ID {0} ont été supprimés avec succès.", userId);
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[TokenService][DeleteAllByUserIdAsync] - Une erreur s'est produite lors de la suppression de tous les tokens pour l'utilisateur : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la suppression de tous les tokens pour l'utilisateur.");
        }
    }

    public async Task DeleteAllAsync()
    {
        try
        {
            await _tokenRepository.DeleteAllAsync();
            _logger.LogInformation(LogEvents.DeleteItem, "[TokenService][DeleteAllAsync] - Tous les tokens ont été supprimés avec succès.");
        }
        catch (AppException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(LogEvents.InternalError, "[TokenService][DeleteAllAsync] - Une erreur s'est produite lors de la suppression de tous les tokens : {0}", ex.Message);
            throw new AppException((int)HttpStatusCode.InternalServerError, "Une erreur s'est produite lors de la suppression de tous les tokens.");
        }
    }

}

