namespace DocumentManager.Repositories;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using DocumentManager.Models.Entities;
using DocumentManager.Helpers;

public interface IDocumentRepository
{
    IQueryable<DocumentEntity> FindAll();
    Task<DocumentEntity?> FindById(Guid id = new Guid());
    Task<DocumentEntity?> Save(DocumentEntity? document);
    Task<DocumentEntity?> Update(DocumentEntity? category);
    Task DeleteById(Guid id = new Guid());
}

public class DocumentRepository : IDocumentRepository
{
    private readonly ApplicationDbContext _context;

    public DocumentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public IQueryable<DocumentEntity> FindAll()
    {
        return _context.Set<DocumentEntity>().AsQueryable();
    }

    public async Task<DocumentEntity?> FindById(Guid id = new Guid())
    {
        return await _context.Set<DocumentEntity>().AsQueryable().FirstOrDefaultAsync(document => document.Id == id);
    }

    public async Task<DocumentEntity?> Save(DocumentEntity? document)
    {
        if (document == null) return null;
        EntityEntry<DocumentEntity> documentResult = _context.Documents.Add(document);
        await _context.SaveChangesAsync();
        return documentResult.Entity;
    }

    public async Task<DocumentEntity?> Update(DocumentEntity? document)
    {
        if (document == null) return null;
        EntityEntry<DocumentEntity> documentResult = _context.Documents.Update(document);
        await _context.SaveChangesAsync();
        // Alternative
        /*
        try
        {
            _context.Entry(document).CurrentValues.SetValues(document);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            return document;
        }
        */
        return documentResult.Entity;
    }

    public async Task DeleteById(Guid id = new Guid())
    {
        DocumentEntity? document = this.FindById(id)?.Result;
        if (document != null)
        {
            _context.Documents.Remove(document);
            await _context.SaveChangesAsync();
        }
    }
}
