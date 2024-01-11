namespace DocumentManager.Helpers;

using DocumentManager.Models.DTO.Category.Response;
using DocumentManager.Models.DTO.Document.Response;
using DocumentManager.Models.Entities;
using Microsoft.Extensions.Configuration;

public static class DocumentUtil
{
	private static IConfiguration? _configuration;

	public static void Initialize(IConfiguration? configuration)
	{
		_configuration = configuration;
	}

	public static void UpdateDocumentUrl(DocumentEntity? existingDocument)
	{
        if (_configuration == null || existingDocument == null) return;
		string filePath = existingDocument.FilePath ?? "";
		string documentBaseUrl = _configuration["DocumentBaseUrl"] ?? "https://localhost:443";
		string secureUrl = $"{documentBaseUrl}/{filePath}";
		existingDocument.FileUrl = secureUrl;
	}

    public static void ApplyUpdateDocumentURLToCategoryAndSubcategories(CategoryEntity categoryEntity)
    {
        if (_configuration == null) return;
        foreach (DocumentEntity documentEntity in categoryEntity.Documents)
        {
            if (documentEntity != null)
            {
                string filePath = documentEntity.FilePath ?? "";
                string documentBaseUrl = _configuration["DocumentBaseUrl"] ?? "https://localhost:443";
                string secureUrl = $"{documentBaseUrl}/{filePath}";
                documentEntity.FileUrl = secureUrl;
            }
        }
        if (categoryEntity.Subcategories != null && categoryEntity.Subcategories.Any())
        {
            foreach (CategoryEntity subcategoryEntity in categoryEntity.Subcategories)
            {
                ApplyUpdateDocumentURLToCategoryAndSubcategories(subcategoryEntity);
            }
        }
    }
}