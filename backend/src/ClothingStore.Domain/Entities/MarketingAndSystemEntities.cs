using ClothingStore.Domain.Common;
using ClothingStore.Domain.Enums;

namespace ClothingStore.Domain.Entities;

public class ProductReview : BaseEntity
{
    public Guid ProductId { get; set; }
    public Guid? UserId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public int Rating { get; set; } = 5;
    public string Comment { get; set; } = string.Empty;
    public ReviewStatus Status { get; set; } = ReviewStatus.Pending;
    public Guid? ModeratedBy { get; set; }
    public DateTimeOffset? ModeratedAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public virtual Product Product { get; set; } = null!;
    public virtual User? User { get; set; }
}

public class CampaignBanner : AuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string CtaText { get; set; } = "Explore Collection";
    public string CtaLink { get; set; } = "/shop";
    public string DesktopImageUrl { get; set; } = string.Empty;
    public string MobileImageUrl { get; set; } = string.Empty;
    public int DisplayOrder { get; set; } = 0;
    public bool Active { get; set; } = true;
}

public class AppNotification : BaseEntity
{
    public Guid? UserId { get; set; } // Null represents global/broadcast notification
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public NotificationCategory Category { get; set; } = NotificationCategory.Order;
    public NotificationTarget Target { get; set; } = NotificationTarget.Customer;
    public bool IsRead { get; set; } = false;
    public DateTimeOffset? ReadAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public virtual User? User { get; set; }
}

public class ContentBlock : BaseEntity
{
    public string Slug { get; set; } = string.Empty; // 'faq', 'size-guide', 'shipping-policy', etc.
    public string Title { get; set; } = string.Empty;
    public string ContentJson { get; set; } = "{}";
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    public Guid? UpdatedBy { get; set; }
}

public class BrandSettings
{
    public int Id { get; set; } = 1; // Enforce single record (singleton)
    public string BrandName { get; set; } = "MAISON VÉRA";
    public string Tagline { get; set; } = "Haute Prêt-à-Porter & Architecture Vestimentaire";
    public string Description { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = "atelier@maisonvera.com";
    public string ContactPhone { get; set; } = "+977 1 4239800";
    public string FlagshipAddress { get; set; } = "Durbar Marg, Heritage Boulevard, Kathmandu, Nepal";
    public string AnnouncementBarText { get; set; } = "COMPLIMENTARY WHITE-GLOVE ATELIER DELIVERY IN KATHMANDU VALLEY";
    public bool AnnouncementBarActive { get; set; } = true;
    public string InstagramUrl { get; set; } = "https://instagram.com/maisonvera";
    public string PinterestUrl { get; set; } = "https://pinterest.com/maisonvera";
    public string WeiboUrl { get; set; } = "https://weibo.com/maisonvera";
    public bool ExpressDeliveryEnabled { get; set; } = true;
    public decimal FreeShippingThreshold { get; set; } = 10000.00m;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    public Guid? UpdatedBy { get; set; }
}

public class PaymentGatewaySettings
{
    public int Id { get; set; } = 1; // Enforce single record (singleton)
    public bool CodEnabled { get; set; } = true;
    public string CodInstructions { get; set; } = string.Empty;
    public bool EsewaEnabled { get; set; } = true;
    public string EsewaMerchantId { get; set; } = string.Empty;
    public string EsewaQrImageUrl { get; set; } = string.Empty;
    public bool KhaltiEnabled { get; set; } = true;
    public string KhaltiMerchantId { get; set; } = string.Empty;
    public string KhaltiQrImageUrl { get; set; } = string.Empty;
    public bool FonepayEnabled { get; set; } = true;
    public string FonepayMerchantName { get; set; } = string.Empty;
    public string FonepayQrImageUrl { get; set; } = string.Empty;
    public string PaymentInstructions { get; set; } = string.Empty;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    public Guid? UpdatedBy { get; set; }
}

public class AuditLog : BaseEntity
{
    public Guid? UserId { get; set; }
    public string UserEmail { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty; // 'CREATE', 'UPDATE', 'DELETE', 'VERIFY_PAYMENT', etc.
    public string Module { get; set; } = string.Empty; // 'Catalog', 'Orders', 'Payments', 'Inventory', etc.
    public string Details { get; set; } = "{}"; // JSON string
    public string IpAddress { get; set; } = string.Empty;
    public string? UserAgent { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
