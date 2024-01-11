namespace DocumentManager.Models.Entities;

[Serializable]
public class DocumentEntity
{
    public Guid Id { get; set; }
    public DateTime? CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; } = DateTime.Now;
    public string? Title { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public string? FilePath { get; set; } = string.Empty;
    public string? FileUrl { get; set; } = string.Empty;
    public IFormFile? File { get; set; }
    public Guid? SenderUserId { get; set; }
    public virtual UserEntity? SenderUser { get; set; }
    public Guid? ValidatorUserId { get; set; }
    public virtual UserEntity? ValidatorUser { get; set; }
    public bool? IsValidated { get; set; } = false;
    public DateTime? ValidatedAt { get; set; }
    public virtual ICollection<CategoryDocumentEntity> CategoriesDocuments { get; set; } = new List<CategoryDocumentEntity>();
    public virtual ICollection<CategoryEntity> Categories { get; set; } = new List<CategoryEntity>();
}

