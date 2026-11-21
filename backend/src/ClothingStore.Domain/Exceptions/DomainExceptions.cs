namespace ClothingStore.Domain.Exceptions;

public class DomainException : Exception
{
    public DomainException(string message) : base(message) { }
    public DomainException(string message, Exception innerException) : base(message, innerException) { }
}

public class InsufficientStockException : DomainException
{
    public string Sku { get; }
    public int Requested { get; }
    public int Available { get; }

    public InsufficientStockException(string sku, int requested, int available)
        : base($"Insufficient stock for variant SKU '{sku}'. Requested: {requested}, Available: {available}.")
    {
        Sku = sku;
        Requested = requested;
        Available = available;
    }
}

public class InvalidOrderStateTransitionException : DomainException
{
    public InvalidOrderStateTransitionException(string currentStatus, string targetStatus)
        : base($"Order status transition from '{currentStatus}' to '{targetStatus}' is prohibited.") { }
}

public class CouponValidationException : DomainException
{
    public string Code { get; }

    public CouponValidationException(string code, string reason)
        : base($"Coupon '{code}' is invalid: {reason}")
    {
        Code = code;
    }
}

public class EntityNotFoundException : DomainException
{
    public EntityNotFoundException(string entityName, object key)
        : base($"Entity '{entityName}' with identifier '{key}' was not found.") { }
}
