using Microsoft.EntityFrameworkCore;
using ClothingStore.Domain.Entities;

namespace ClothingStore.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Role> Roles { get; }
    DbSet<RoleClaim> RoleClaims { get; }
    DbSet<UserRole> UserRoles { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    DbSet<CustomerProfile> CustomerProfiles { get; }
    DbSet<StaffProfile> StaffProfiles { get; }
    DbSet<CustomerAddress> CustomerAddresses { get; }
    DbSet<Category> Categories { get; }
    DbSet<Collection> Collections { get; }
    DbSet<CollectionProduct> CollectionProducts { get; }
    DbSet<Product> Products { get; }
    DbSet<ProductImage> ProductImages { get; }
    DbSet<ProductSize> ProductSizes { get; }
    DbSet<ProductColor> ProductColors { get; }
    DbSet<ProductVariant> ProductVariants { get; }
    DbSet<StockMovement> StockMovements { get; }
    DbSet<CartItem> CartItems { get; }
    DbSet<WishlistItem> WishlistItems { get; }
    DbSet<Coupon> Coupons { get; }
    DbSet<DeliveryZone> DeliveryZones { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<OrderTimelineEvent> OrderTimelineEvents { get; }
    DbSet<ProductReview> ProductReviews { get; }
    DbSet<CampaignBanner> CampaignBanners { get; }
    DbSet<AppNotification> Notifications { get; }
    DbSet<ContentBlock> ContentBlocks { get; }
    DbSet<BrandSettings> BrandSettings { get; }
    DbSet<PaymentGatewaySettings> PaymentGatewaySettings { get; }
    DbSet<AuditLog> AuditLogs { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

public interface ICurrentUserService
{
    Guid? UserId { get; }
    string? Email { get; }
    string? Role { get; }
    string? UserType { get; }
    bool IsAuthenticated { get; }
    string? IpAddress { get; }
    string? UserAgent { get; }
}

public interface IJwtService
{
    (string Token, int ExpiresIn) GenerateAccessToken(User user, string roleName);
    string GenerateRefreshToken();
    string HashToken(string token);
}

public interface IPasswordHasher
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string passwordHash);
}

public interface IFileStorageService
{
    Task<string> UploadFileAsync(Stream stream, string fileName, string contentType, string bucketName, CancellationToken cancellationToken = default);
    Task<string> GetSignedUrlAsync(string bucketName, string filePath, TimeSpan expiry);
    Task DeleteFileAsync(string bucketName, string filePath, CancellationToken cancellationToken = default);
}

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string htmlBody, CancellationToken cancellationToken = default);
}
