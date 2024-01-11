using DocumentManager.Helpers.Authorization;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DocumentManager.Models.Entities;
public class TokenEntity
{
    public Guid Id { get; set; }
    public DateTime? CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; } = DateTime.Now;
    public string? Token { get; set; } = string.Empty;
    public TokenType TokenType { get; set; } = TokenType.Bearer;
    public bool? Revoked { get; set; } = true;
    public bool? Expired { get; set; } = true;
    public Guid? UserId { get; set; } = Guid.Empty;
    public virtual UserEntity? User { get; set; }
}
