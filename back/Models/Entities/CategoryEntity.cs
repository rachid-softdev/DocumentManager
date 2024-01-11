namespace DocumentManager.Models.Entities;

[Serializable]
public class CategoryEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime? CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; } = DateTime.Now;
    public string? Name { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    // Les sous catégories
    public Guid? ParentCategoryId { get; set; } = Guid.Empty;
    public virtual ICollection<CategoryEntity> Subcategories { get; set; } = new List<CategoryEntity>();
    // Les abonnés appartenant aux diverses catégories
    public virtual ICollection<UserCategorySubscriptionEntity> UserCategorySubscriptions { get; set; } = new List<UserCategorySubscriptionEntity>();
    public virtual ICollection<UserEntity> Subscribers { get; set; } = new List<UserEntity>();
    // les documents appartenant aux diverses catégories
    public virtual ICollection<CategoryDocumentEntity> CategoriesDocuments { get; set; } = new List<CategoryDocumentEntity>();
    public virtual ICollection<DocumentEntity> Documents { get; set; } = new List<DocumentEntity>();
}
