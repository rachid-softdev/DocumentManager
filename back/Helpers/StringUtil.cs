namespace DocumentManager.Helpers;

using System.Security.Cryptography;
using System.Text;

public static class StringUtil
{
    public static string EncodeFileName(string fileName)
    {
        if (string.IsNullOrEmpty(fileName))
        {
            throw new ArgumentException("Le nom du fichier ne peut pas être null ou vide.", nameof(fileName));
        }
        byte[] fileNameBytes = Encoding.UTF8.GetBytes(fileName);
        using (MD5 md5 = MD5.Create())
        {
            byte[] hashBytes = md5.ComputeHash(fileNameBytes);
            string encodedFileName = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            return encodedFileName;
        }
    }
}