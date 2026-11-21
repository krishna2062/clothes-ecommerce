namespace ClothingStore.Application.Common.Models;

public class ApiResponse<T>
{
    public bool Success { get; set; } = true;
    public T? Data { get; set; }
    public ApiError? Error { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;
    public PaginationMetadata? Pagination { get; set; }

    public static ApiResponse<T> Ok(T data, string message = "Operation completed successfully.", PaginationMetadata? pagination = null)
    {
        return new ApiResponse<T>
        {
            Success = true,
            Data = data,
            Error = null,
            Message = message,
            Pagination = pagination
        };
    }

    public static ApiResponse<T> Fail(string code, string message, List<ValidationErrorItem>? validationErrors = null, string? traceId = null)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Data = default,
            Error = new ApiError
            {
                Code = code,
                Message = message,
                TraceId = traceId,
                ValidationErrors = validationErrors ?? new List<ValidationErrorItem>()
            },
            Message = message
        };
    }
}

public class ApiError
{
    public string Code { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? TraceId { get; set; }
    public List<ValidationErrorItem> ValidationErrors { get; set; } = new();
}

public class ValidationErrorItem
{
    public string Field { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;

    public ValidationErrorItem() { }

    public ValidationErrorItem(string field, string message)
    {
        Field = field;
        Message = message;
    }
}

public class PaginationMetadata
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;

    public PaginationMetadata(int page, int pageSize, int totalCount)
    {
        Page = page;
        PageSize = pageSize;
        TotalCount = totalCount;
    }
}

public class PaginatedList<T>
{
    public List<T> Items { get; }
    public PaginationMetadata Metadata { get; }

    public PaginatedList(List<T> items, int totalCount, int page, int pageSize)
    {
        Items = items;
        Metadata = new PaginationMetadata(page, pageSize, totalCount);
    }
}
