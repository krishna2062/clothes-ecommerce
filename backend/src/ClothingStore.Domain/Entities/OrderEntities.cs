using ClothingStore.Domain.Common;
using ClothingStore.Domain.Enums;

namespace ClothingStore.Domain.Entities;

public class Order : AuditableEntity
{
    public string OrderNumber { get; set; } = string.Empty;
    public Guid? UserId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.UtcNow;

    // Financial breakdown snapshots
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; } = 0.00m;
    public Guid? CouponId { get; set; }
    public string? CouponCode { get; set; }
    public DeliveryMethodType DeliveryMethod { get; set; } = DeliveryMethodType.Standard;
    public decimal DeliveryCharge { get; set; } = 0.00m;
    public decimal TotalAmount { get; set; }

    // Payment details
    public PaymentMethodType PaymentMethod { get; set; } = PaymentMethodType.COD;
    public PaymentStatusType PaymentStatus { get; set; } = PaymentStatusType.PendingVerification;
    public string? TransactionRef { get; set; }
    public string? PaymentScreenshotUrl { get; set; }
    public string? RejectionReason { get; set; }
    public DateTimeOffset? VerifiedAt { get; set; }
    public Guid? VerifiedBy { get; set; }

    // Fulfillment state machine
    public OrderStatusType OrderStatus { get; set; } = OrderStatusType.Placed;
    public bool CancellationRequested { get; set; } = false;
    public string? CancellationReason { get; set; }
    public DateTimeOffset? CancelledAt { get; set; }
    public string? AdminNotes { get; set; }

    // Immutable physical shipping address snapshot
    public string ShippingProvince { get; set; } = string.Empty;
    public string ShippingDistrict { get; set; } = string.Empty;
    public string ShippingMunicipality { get; set; } = string.Empty;
    public string ShippingWard { get; set; } = string.Empty;
    public string ShippingStreet { get; set; } = string.Empty;
    public string ShippingLandmark { get; set; } = string.Empty;
    public string? ShippingInstructions { get; set; }

    public Guid ConcurrencyToken { get; set; } = Guid.NewGuid();

    public virtual User? User { get; set; }
    public virtual Coupon? Coupon { get; set; }
    public virtual ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    public virtual ICollection<OrderTimelineEvent> TimelineEvents { get; set; } = new List<OrderTimelineEvent>();
}

public class OrderItem : BaseEntity
{
    public Guid OrderId { get; set; }
    public Guid ProductId { get; set; }
    public Guid VariantId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductSlug { get; set; } = string.Empty;
    public string ProductSku { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public decimal OriginalPrice { get; set; }
    public int Quantity { get; set; } = 1;
    public decimal LineTotal { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public virtual Order Order { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
    public virtual ProductVariant Variant { get; set; } = null!;
}

public class OrderTimelineEvent : BaseEntity
{
    public Guid OrderId { get; set; }
    public OrderStatusType Status { get; set; }
    public string Note { get; set; } = string.Empty;
    public Guid? PerformedBy { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public virtual Order Order { get; set; } = null!;
}

public class CartItem : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
    public Guid VariantId { get; set; }
    public int Quantity { get; set; } = 1;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public virtual User User { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
    public virtual ProductVariant Variant { get; set; } = null!;
}

public class WishlistItem : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public virtual User User { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
}

public class Coupon : AuditableEntity
{
    public string Code { get; set; } = string.Empty;
    public CouponDiscountType DiscountType { get; set; } = CouponDiscountType.Percentage;
    public decimal DiscountValue { get; set; }
    public decimal MinOrderAmount { get; set; } = 0.00m;
    public decimal? MaxDiscountAmount { get; set; }
    public DateTimeOffset ExpiryDate { get; set; }
    public int UsageLimit { get; set; } = 100;
    public int UsedCount { get; set; } = 0;
    public CouponStatus Status { get; set; } = CouponStatus.Active;

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}

public class DeliveryZone : BaseEntity
{
    public string Province { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public decimal StandardCharge { get; set; } = 0.00m;
    public decimal ExpressCharge { get; set; } = 150.00m;
    public string EstimatedTime { get; set; } = "1-2 Business Days";
    public bool Active { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}
