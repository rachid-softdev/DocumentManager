namespace DocumentManager.Models.DTO.Document.Request;

using Microsoft.AspNetCore.Mvc;

public class DocumentFilters
{
    [FromQuery(Name = "category_id")]
    public Guid? CategoryId { get; set; }

    [FromQuery(Name = "title")]
    public string? Title { get; set; }

    [FromQuery(Name = "description")]
    public string? Description { get; set; }

    [FromQuery(Name = "is_validated")]
    public bool? IsValidated { get; set; }

    [FromQuery(Name = "author_id")]
    public Guid? AuthorId { get; set; }
}


