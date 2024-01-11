namespace DocumentManager.Repositories;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using DocumentManager.Models.Entities;
using DocumentManager.Helpers;

public interface IUserRoleRepository
{
	IQueryable<UserRoleEntity> FindAll();

}

public class UserRoleRepository : IUserRoleRepository
{
	private readonly ApplicationDbContext _context;

	public UserRoleRepository(ApplicationDbContext context)
	{
		_context = context;
	}

	public IQueryable<UserRoleEntity> FindAll()
	{
        return _context.Set<UserRoleEntity>().AsQueryable();
    }

}