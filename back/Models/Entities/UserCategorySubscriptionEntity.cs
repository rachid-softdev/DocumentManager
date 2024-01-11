namespace DocumentManager.Models.Entities;

[Serializable]
public class UserCategorySubscriptionEntity
{
    public Guid UserId { get; set; } = Guid.NewGuid();
    public virtual UserEntity? User { get; set; }
    public Guid CategoryId { get; set; } = Guid.NewGuid();
    public virtual CategoryEntity? Category { get; set; }
}
