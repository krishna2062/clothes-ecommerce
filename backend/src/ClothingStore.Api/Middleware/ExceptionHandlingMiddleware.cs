using System.Diagnostics;
using System.Text.Json;
using ClothingStore.Application.Common.Models;
using ClothingStore.Domain.Exceptions;

namespace ClothingStore.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var traceId = Activity.Current?.Id ?? context.TraceIdentifier;
        _logger.LogError(exception, "Unhandled error occurred. TraceId: {TraceId}", traceId);

        context.Response.ContentType = "application/json";

        var (statusCode, code, message) = exception switch
        {
            InsufficientStockException ex => (StatusCodes.Status400BadRequest, "INSUFFICIENT_STOCK", ex.Message),
            InvalidOrderStateTransitionException ex => (StatusCodes.Status400BadRequest, "INVALID_STATE_TRANSITION", ex.Message),
            CouponValidationException ex => (StatusCodes.Status400BadRequest, "INVALID_COUPON", ex.Message),
            EntityNotFoundException ex => (StatusCodes.Status404NotFound, "NOT_FOUND", ex.Message),
            DomainException ex => (StatusCodes.Status400BadRequest, "DOMAIN_RULE_VIOLATION", ex.Message),
            UnauthorizedAccessException ex => (StatusCodes.Status401Unauthorized, "UNAUTHORIZED", ex.Message),
            _ => (StatusCodes.Status500InternalServerError, "INTERNAL_SERVER_ERROR", "An unexpected error occurred. Our atelier team has been notified.")
        };

        context.Response.StatusCode = statusCode;
        var response = ApiResponse<object>.Fail(code, message, null, traceId);

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}
