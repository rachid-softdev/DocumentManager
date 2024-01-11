namespace DocumentManager.Repositories;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using DocumentManager.Helpers;
using DocumentManager.Models.Entities;

public interface ITokenRepository
{
    IQueryable<TokenEntity> FindAll();
    IQueryable<TokenEntity> FindAllByUserId(Guid userId = new Guid());
    IQueryable<TokenEntity> FindAllValidByUserId(Guid userId = new Guid());
    Task<TokenEntity?> FindByIdAsync(Guid id = new Guid());
    Task<TokenEntity?> FindByTokenAsync(string token = "");
    Task<TokenEntity?> SaveAsync(TokenEntity? token);
    Task<TokenEntity?> UpdateAsync(TokenEntity? category);
    Task DeleteByIdAsync(Guid id = new Guid());
    Task DeleteAllByUserIdAsync(Guid userId = new Guid());
    Task DeleteAllAsync();
}

public class TokenRepository : ITokenRepository
{
    private readonly ApplicationDbContext _context;

    public TokenRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public IQueryable<TokenEntity> FindAll()
    {
        return _context.Set<TokenEntity>().AsQueryable();
    }

    public IQueryable<TokenEntity> FindAllByUserId(Guid userId = new Guid())
    {
        return _context.Set<TokenEntity>().AsQueryable().Where(token => token.UserId == userId);
    }

    public IQueryable<TokenEntity> FindAllValidByUserId(Guid userId = new Guid())
    {
        return _context.Set<TokenEntity>().AsQueryable()
            .Where(token => token.UserId == userId && token.Expired == false && token.Revoked == false)
            .AsQueryable();
    }

    public async Task<TokenEntity?> FindByIdAsync(Guid id = new Guid())
    {
        return await _context.Set<TokenEntity>().AsQueryable().FirstOrDefaultAsync(token => token.Id == id);
    }

    public async Task<TokenEntity?> FindByTokenAsync(string token = "")
    {
        return await _context.Set<TokenEntity>().AsQueryable().FirstOrDefaultAsync(t => t.Token != null && EF.Functions.Like(t.Token, token));
    }

    public async Task<TokenEntity?> SaveAsync(TokenEntity? token)
    {
        if (token == null) return null;
        EntityEntry<TokenEntity> tokenResult = _context.Tokens.Add(token);
        await _context.SaveChangesAsync();
        return tokenResult.Entity;
    }

    public async Task<TokenEntity?> UpdateAsync(TokenEntity? token)
    {
        if (token == null) return null;
        EntityEntry<TokenEntity> tokenResult = _context.Tokens.Update(token);
        await _context.SaveChangesAsync();
        return tokenResult.Entity;
    }

    public async Task DeleteByIdAsync(Guid id = new Guid())
    {
        TokenEntity? token = this.FindByIdAsync(id)?.Result;
        if (token != null)
        {
            _context.Tokens.Remove(token);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteAllByUserIdAsync(Guid userId = new Guid())
    {
        var tokensToDelete = _context.Set<TokenEntity>().Where(token => token.UserId == userId);
        _context.Set<TokenEntity>().RemoveRange(tokensToDelete);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAllAsync()
    {
        var allTokens = _context.Set<TokenEntity>();
        _context.Set<TokenEntity>().RemoveRange(allTokens);
        await _context.SaveChangesAsync();
    }
}