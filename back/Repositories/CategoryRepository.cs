namespace DocumentManager.Repositories;

using DocumentManager.Models.Entities;
using DocumentManager.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

public interface ICategoryRepository
{
    IQueryable<CategoryEntity> FindAll();
    Task<CategoryEntity?> FindById(Guid id = new Guid());
    Task<CategoryEntity?> Save(CategoryEntity? category);
    Task<CategoryEntity?> Update(CategoryEntity? category);
    Task<bool> DeleteById(Guid id = new Guid());
}

public class CategoryRepository : ICategoryRepository
{
    private readonly ApplicationDbContext _context;

    public CategoryRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public IQueryable<CategoryEntity> FindAll()
    {
        return _context.Set<CategoryEntity>().AsQueryable();
    }

    public async Task<CategoryEntity?> FindById(Guid id = new Guid())
    {
        return await _context.Set<CategoryEntity>().AsQueryable().FirstOrDefaultAsync(category => category.Id == id);
    }

    public async Task<CategoryEntity?> Save(CategoryEntity? category)
    {
        if (category == null) return null;
        EntityEntry<CategoryEntity> categoryResult = _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return categoryResult.Entity;
    }

    public async Task<CategoryEntity?> Update(CategoryEntity? category)
    {
        if (category == null) return null;
        EntityEntry<CategoryEntity> categoryResult = _context.Categories.Update(category);
        await _context.SaveChangesAsync();
        return categoryResult.Entity;
    }

    public async Task<bool> DeleteById(Guid id = new Guid())
    {
        CategoryEntity? category = await _context.Categories.FindAsync(id);
        if (category != null)
        {
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }
        return false;
    }
}
