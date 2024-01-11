
namespace DocumentManager.Helpers;

using System.Security.Cryptography;
using System.Text;

public enum AllowedFileTypes
{
	Txt,
	Pdf,
	Doc,
	Docx
}

public static class FileUtil
{
	public static bool IsValidFileType(string fileName)
	{
		string extension = Path.GetExtension(fileName)?.TrimStart('.') ?? "";
		if (string.IsNullOrEmpty(extension) || !Enum.TryParse<AllowedFileTypes>(extension, true, out var fileType))
		{
			return false;
		}
		switch (fileType)
		{
			case AllowedFileTypes.Txt:
			case AllowedFileTypes.Pdf:
			case AllowedFileTypes.Doc:
			case AllowedFileTypes.Docx:
				break;
			default:
				return false;
		}
		return true;
	}
}