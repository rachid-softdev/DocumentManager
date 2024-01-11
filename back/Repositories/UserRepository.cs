namespace DocumentManager.Repositories;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using DocumentManager.Models.Entities;
using DocumentManager.Helpers;
using Microsoft.AspNetCore.Identity;

/**
 * Cette classe est une surcouche repository qui utilise le UserManager fournit par .NET
 * afin de réaliser les actions sur l'entité User car elle utilise le IdentityUser
*/
public interface IUserRepository
{
    IQueryable<UserEntity> FindAll();
    Task<UserEntity?> FindByIdAsync(Guid id = new Guid());
    Task<UserEntity?> FindByEmailAsync(string email = "");
    Task<UserEntity?> SaveAsync(UserEntity? user);
    Task<UserEntity?> SaveAsync(UserEntity? user, string password = "");
    Task<UserEntity?> UpdateAsync(UserEntity? user);
    Task DeleteByIdAsync(Guid id = new Guid());
}

public class UserRepository : IUserRepository
{
    private readonly UserManager<UserEntity> _userManager;
    
    public UserRepository(UserManager<UserEntity> userManager)
    {
        _userManager = userManager;
    }

    public IQueryable<UserEntity> FindAll()
    {
        return _userManager.Users.AsQueryable();
    }

    public async Task<UserEntity?> FindByIdAsync(Guid id = new Guid())
    {
        return await _userManager.FindByIdAsync(id.ToString());
    }

    public async Task<UserEntity?> FindByEmailAsync(string email = "")
    {
        return await _userManager.FindByEmailAsync(email);
    }

    public async Task<UserEntity?> SaveAsync(UserEntity? user)
    {
        if (user == null) return null;
        IdentityResult result = await _userManager.CreateAsync(user);
        // DEBUG
        /*
        if (!result.Succeeded)
            foreach (IdentityError error in result.Errors)
                Console.WriteLine($"Oops! {error.Description} ({error.Code})");
        */
        if (result.Succeeded)
        {
            return user;
        }
        return null;
    }

    public async Task<UserEntity?> SaveAsync(UserEntity? user, string password = "")
    {
        if (user == null) return null;
        IdentityResult result = await _userManager.CreateAsync(user, password);
        // DEBUG
        /*
        if (!result.Succeeded)
            foreach (IdentityError error in result.Errors)
                Console.WriteLine($"Oops! {error.Description} ({error.Code})");
        */
        if (result.Succeeded)
        {
            return user;
        }
        return null;
    }

    public async Task<UserEntity?> UpdateAsync(UserEntity? user)
    {
        if (user == null) return null;
        IdentityResult updateResult = await _userManager.UpdateAsync(user);
        if (updateResult.Succeeded)
        {
            return user;
        }
        return null;
    }

    public async Task DeleteByIdAsync(Guid id = new Guid())
    {
        UserEntity? user = await FindByIdAsync(id);
        if (user != null)
        {
            await _userManager.DeleteAsync(user);
        }
    }
}
