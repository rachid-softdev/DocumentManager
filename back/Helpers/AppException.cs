namespace DocumentManager.Helpers;

using System.Globalization;
using System.Net;

/** 
 * Classe d'exception personnalisée pour lancer des exceptions spécifiques à l'application 
qui peuvent être capturées et traitées à l'intérieur de l'application
*/

public class AppException : Exception
{
    public int HttpStatus  { get; } = (int) HttpStatusCode.InternalServerError;

    public AppException(int httpStatusCode) : base()
    {
        HttpStatus = httpStatusCode;
    }

    public AppException(int httpStatusCode, string message) : base(message)
    {
        HttpStatus = httpStatusCode;
    }

    public AppException(int httpStatusCode, string message, params object[] args)
        : base(string.Format(CultureInfo.CurrentCulture, message, args))
    {
        HttpStatus = httpStatusCode;
    }
}