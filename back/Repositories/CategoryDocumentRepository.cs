namespace DocumentManager.Repositories;

using DocumentManager.Models.Entities;
using DocumentManager.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

public interface ICategoryDocumentRepository
{
    IQueryable<CategoryDocumentEntity> FindAll();
    IQueryable<CategoryDocumentEntity> FindAllByCategoryId(Guid categoryId = new Guid());
    IQueryable<CategoryDocumentEntity> FindAllByDocumentId(Guid documentId = new Guid());
    Task<CategoryDocumentEntity?> FindByIdsAsync(Guid categoryId = new Guid(), Guid documentId = new Guid());
    Task<CategoryDocumentEntity?> SaveAsync(CategoryDocumentEntity? category);
    Task DeleteByIdsAsync(Guid categoryId = new Guid(), Guid documentId = new Guid());
}

public class CategoryDocumentRepository : ICategoryDocumentRepository
{
    private readonly ApplicationDbContext _context;

    public CategoryDocumentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public IQueryable<CategoryDocumentEntity> FindAll()
    {
        return _context.Set<CategoryDocumentEntity>().AsQueryable();
    }

    public IQueryable<CategoryDocumentEntity> FindAllByCategoryId(Guid categoryId = new Guid())
    {
        return _context.Set<CategoryDocumentEntity>().AsQueryable()
           .Where(categoryDocument => categoryDocument.CategoryId == categoryId);
    }

    public IQueryable<CategoryDocumentEntity> FindAllByDocumentId(Guid documentId = new Guid())
    {
        return _context.Set<CategoryDocumentEntity>().AsQueryable()
            .Where(categoryDocument => categoryDocument.DocumentId == documentId);
    }

    public async Task<CategoryDocumentEntity?> FindByIdsAsync(Guid categoryId = new Guid(), Guid documentId = new Guid())
    {
        return await _context.Set<CategoryDocumentEntity>().AsQueryable().FirstOrDefaultAsync(categoryDocument => categoryDocument.CategoryId == categoryId && categoryDocument.DocumentId == documentId);
    }

    public async Task<CategoryDocumentEntity?> SaveAsync(CategoryDocumentEntity? categoryDocument)
    {
        if (categoryDocument == null) return null;
        EntityEntry<CategoryDocumentEntity> categoryDocumentResult = _context.CategoriesDocuments.Add(categoryDocument);
        await _context.SaveChangesAsync();
        return categoryDocumentResult.Entity;
    }

    public async Task DeleteByIdsAsync(Guid categoryId = new Guid(), Guid documentId = new Guid())
    {
        CategoryDocumentEntity? categoryDocument = this.FindByIdsAsync(categoryId, documentId)?.Result;
        if (categoryDocument != null)
        {
            _context.CategoriesDocuments.Remove(categoryDocument);
            await _context.SaveChangesAsync();
        }
    }
}
