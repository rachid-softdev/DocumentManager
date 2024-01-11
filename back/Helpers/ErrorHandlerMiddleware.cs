namespace DocumentManager.Helpers;

using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

public class ErrorHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger _logger;

    public ErrorHandlerMiddleware(RequestDelegate next, ILogger<ErrorHandlerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception error)
        {
            HttpResponse response = context.Response;
            response.ContentType = "application/json";
            int httpStatusCode;
            switch (error)
            {
                case AppException appException:
                    httpStatusCode = appException.HttpStatus;
                    break;
                case KeyNotFoundException:
                    httpStatusCode = (int)HttpStatusCode.NotFound;
                    break;
                default:
                    _logger.LogError(error, error.Message);
                    httpStatusCode = (int)HttpStatusCode.InternalServerError;
                    break;
            }
            response.StatusCode = httpStatusCode;
            string result = JsonSerializer.Serialize(new { status = response.StatusCode, error = new { message = error?.Message ?? "" } });
            await response.WriteAsync(result);
            return;
        }
    }
}