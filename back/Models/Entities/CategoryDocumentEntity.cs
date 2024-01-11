namespace DocumentManager.Models.Entities;

[Serializable]
public class CategoryDocumentEntity
{
    public Guid CategoryId = Guid.NewGuid();
    public virtual CategoryEntity? Category { get; set; }

    public Guid DocumentId = Guid.NewGuid();
    public virtual DocumentEntity? Document { get; set; }
}
