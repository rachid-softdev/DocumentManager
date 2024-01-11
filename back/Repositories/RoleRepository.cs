namespace DocumentManager.Repositories;


using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using DocumentManager.Models.Entities;
using Microsoft.AspNetCore.Identity;

public interface IRoleRepository
{
	IQueryable<RoleEntity> FindAll();
	Task<RoleEntity?> FindById(Guid id = new Guid());
	Task<RoleEntity?> FindByName(string roleName = "");
	Task<RoleEntity?> Save(RoleEntity role);
	Task<RoleEntity?> Update(RoleEntity role);
	Task DeleteById(Guid id = new Guid());
}

public class RoleRepository : IRoleRepository
{
	private readonly RoleManager<RoleEntity> _roleManager;

	public RoleRepository(RoleManager<RoleEntity> roleManager)
	{
		_roleManager = roleManager;
	}

	public IQueryable<RoleEntity> FindAll()
	{
		return _roleManager.Roles.AsQueryable();
	}

	public async Task<RoleEntity?> FindById(Guid id = new Guid())
	{
		return await _roleManager.FindByIdAsync(id.ToString());
	}

	public async Task<RoleEntity?> FindByName(string roleName = "")
	{
		return await _roleManager.FindByNameAsync(roleName);
	}

	public async Task<RoleEntity?> Save(RoleEntity role)
	{
		if (role == null) return null;
		IdentityResult result = await _roleManager.CreateAsync(role);
		return result.Succeeded ? role : null;
	}

	public async Task<RoleEntity?> Update(RoleEntity role)
	{
		if (role == null) return null;
		RoleEntity? existingRole = await FindById(role.Id);
		if (existingRole == null) return null;
		existingRole.Name = role.Name;
		existingRole.NormalizedName = role.NormalizedName;
		IdentityResult updateResult = await _roleManager.UpdateAsync(existingRole);
		return updateResult.Succeeded ? existingRole : null;
	}

	public async Task DeleteById(Guid id = new Guid())
	{
		RoleEntity? role = await FindById(id);
		if (role != null)
		{
			await _roleManager.DeleteAsync(role);
		}
	}
}
