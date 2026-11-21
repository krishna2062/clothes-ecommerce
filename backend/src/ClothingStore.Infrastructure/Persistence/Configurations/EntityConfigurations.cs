using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ClothingStore.Domain.Entities;

namespace ClothingStore.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");
        builder.HasKey(u => u.Id);
        builder.HasIndex(u => u.NormalizedEmail).IsUnique();
        builder.HasIndex(u => u.PhoneNumber).IsUnique();

        builder.Property(u => u.Email).HasMaxLength(256).IsRequired();
        builder.Property(u => u.NormalizedEmail).HasMaxLength(256).IsRequired();
        builder.Property(u => u.PhoneNumber).HasMaxLength(32).IsRequired();
        builder.Property(u => u.PasswordHash).HasMaxLength(1024).IsRequired();
        builder.Property(u => u.UserType).HasConversion<string>().HasMaxLength(32).IsRequired();

        builder.HasOne(u => u.CustomerProfile)
            .WithOne(cp => cp.User)
            .HasForeignKey<CustomerProfile>(cp => cp.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(u => u.StaffProfile)
            .WithOne(sp => sp.User)
            .HasForeignKey<StaffProfile>(sp => sp.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("roles");
        builder.HasKey(r => r.Id);
        builder.HasIndex(r => r.NormalizedName).IsUnique();
        builder.Property(r => r.Name).HasMaxLength(64).IsRequired();
        builder.Property(r => r.NormalizedName).HasMaxLength(64).IsRequired();
    }
}

public class RoleClaimConfiguration : IEntityTypeConfiguration<RoleClaim>
{
    public void Configure(EntityTypeBuilder<RoleClaim> builder)
    {
        builder.ToTable("role_claims");
        builder.HasKey(rc => rc.Id);
        builder.HasIndex(rc => new { rc.RoleId, rc.Module }).IsUnique();
        builder.Property(rc => rc.Module).HasMaxLength(64).IsRequired();
    }
}

public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.ToTable("user_roles");
        builder.HasKey(ur => new { ur.UserId, ur.RoleId });
    }
}

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.ToTable("refresh_tokens");
        builder.HasKey(rt => rt.Id);
        builder.HasIndex(rt => rt.TokenHash).IsUnique();
        builder.Property(rt => rt.TokenHash).HasMaxLength(256).IsRequired();
    }
}

public class CustomerProfileConfiguration : IEntityTypeConfiguration<CustomerProfile>
{
    public void Configure(EntityTypeBuilder<CustomerProfile> builder)
    {
        builder.ToTable("customer_profiles");
        builder.HasKey(cp => cp.UserId);
        builder.Property(cp => cp.FullName).HasMaxLength(128).IsRequired();
        builder.Property(cp => cp.VipTier).HasMaxLength(32).IsRequired();
    }
}

public class StaffProfileConfiguration : IEntityTypeConfiguration<StaffProfile>
{
    public void Configure(EntityTypeBuilder<StaffProfile> builder)
    {
        builder.ToTable("staff_profiles");
        builder.HasKey(sp => sp.UserId);
        builder.Property(sp => sp.FullName).HasMaxLength(128).IsRequired();
        builder.Property(sp => sp.EmployeeCode).HasMaxLength(32).IsRequired();
        builder.HasIndex(sp => sp.EmployeeCode).IsUnique();
    }
}

public class CustomerAddressConfiguration : IEntityTypeConfiguration<CustomerAddress>
{
    public void Configure(EntityTypeBuilder<CustomerAddress> builder)
    {
        builder.ToTable("customer_addresses");
        builder.HasKey(ca => ca.Id);
        builder.Property(ca => ca.FullName).HasMaxLength(128).IsRequired();
        builder.Property(ca => ca.PhoneNumber).HasMaxLength(32).IsRequired();
        builder.Property(ca => ca.Province).HasMaxLength(64).IsRequired();
        builder.Property(ca => ca.District).HasMaxLength(64).IsRequired();
        builder.Property(ca => ca.Municipality).HasMaxLength(128).IsRequired();
        builder.Property(ca => ca.Ward).HasMaxLength(16).IsRequired();
        builder.Property(ca => ca.Street).HasMaxLength(256).IsRequired();
        builder.Property(ca => ca.Landmark).HasMaxLength(256).IsRequired();
    }
}

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("categories");
        builder.HasKey(c => c.Id);
        builder.HasIndex(c => c.Slug).IsUnique();
        builder.Property(c => c.Name).HasMaxLength(128).IsRequired();
        builder.Property(c => c.Slug).HasMaxLength(128).IsRequired();
        builder.Property(c => c.Status).HasConversion<string>().HasMaxLength(32).IsRequired();
    }
}

public class CollectionConfiguration : IEntityTypeConfiguration<Collection>
{
    public void Configure(EntityTypeBuilder<Collection> builder)
    {
        builder.ToTable("collections");
        builder.HasKey(c => c.Id);
        builder.HasIndex(c => c.Slug).IsUnique();
        builder.Property(c => c.Name).HasMaxLength(128).IsRequired();
        builder.Property(c => c.Slug).HasMaxLength(128).IsRequired();
        builder.Property(c => c.Status).HasConversion<string>().HasMaxLength(32).IsRequired();
    }
}

public class CollectionProductConfiguration : IEntityTypeConfiguration<CollectionProduct>
{
    public void Configure(EntityTypeBuilder<CollectionProduct> builder)
    {
        builder.ToTable("collection_products");
        builder.HasKey(cp => new { cp.CollectionId, cp.ProductId });
    }
}

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("products");
        builder.HasKey(p => p.Id);
        builder.HasIndex(p => p.Slug).IsUnique();
        builder.HasIndex(p => p.Sku).IsUnique();

        builder.Property(p => p.Name).HasMaxLength(256).IsRequired();
        builder.Property(p => p.Slug).HasMaxLength(256).IsRequired();
        builder.Property(p => p.Sku).HasMaxLength(64).IsRequired();
        builder.Property(p => p.GenderCollection).HasConversion<string>().HasMaxLength(32).IsRequired();
        builder.Property(p => p.Status).HasConversion<string>().HasMaxLength(32).IsRequired();

        // JSON conversion for MaterialsAndCare list of strings
        var jsonOptions = new JsonSerializerOptions();
        builder.Property(p => p.MaterialsAndCare)
            .HasColumnType("jsonb")
            .HasConversion(
                v => JsonSerializer.Serialize(v, jsonOptions),
                v => JsonSerializer.Deserialize<List<string>>(v, jsonOptions) ?? new List<string>())
            .Metadata.SetValueComparer(new ValueComparer<List<string>>(
                (c1, c2) => c1 != null && c2 != null && c1.SequenceEqual(c2),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => c.ToList()));
    }
}

public class ProductVariantConfiguration : IEntityTypeConfiguration<ProductVariant>
{
    public void Configure(EntityTypeBuilder<ProductVariant> builder)
    {
        builder.ToTable("product_variants");
        builder.HasKey(pv => pv.Id);
        builder.HasIndex(pv => pv.Sku).IsUnique();
        builder.HasIndex(pv => new { pv.ProductId, pv.Size, pv.ColorName }).IsUnique();

        builder.Property(pv => pv.Sku).HasMaxLength(64).IsRequired();
        builder.Property(pv => pv.Size).HasMaxLength(32).IsRequired();
        builder.Property(pv => pv.ColorName).HasMaxLength(64).IsRequired();
        builder.Property(pv => pv.ColorHex).HasMaxLength(16).IsRequired();
    }
}

public class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
{
    public void Configure(EntityTypeBuilder<CartItem> builder)
    {
        builder.ToTable("cart_items");
        builder.HasKey(ci => ci.Id);
        builder.HasIndex(ci => new { ci.UserId, ci.VariantId }).IsUnique();
    }
}

public class WishlistItemConfiguration : IEntityTypeConfiguration<WishlistItem>
{
    public void Configure(EntityTypeBuilder<WishlistItem> builder)
    {
        builder.ToTable("wishlist_items");
        builder.HasKey(wi => wi.Id);
        builder.HasIndex(wi => new { wi.UserId, wi.ProductId }).IsUnique();
    }
}

public class CouponConfiguration : IEntityTypeConfiguration<Coupon>
{
    public void Configure(EntityTypeBuilder<Coupon> builder)
    {
        builder.ToTable("coupons");
        builder.HasKey(c => c.Id);
        builder.HasIndex(c => c.Code).IsUnique();
        builder.Property(c => c.Code).HasMaxLength(64).IsRequired();
        builder.Property(c => c.DiscountType).HasConversion<string>().HasMaxLength(32).IsRequired();
        builder.Property(c => c.Status).HasConversion<string>().HasMaxLength(32).IsRequired();
    }
}

public class DeliveryZoneConfiguration : IEntityTypeConfiguration<DeliveryZone>
{
    public void Configure(EntityTypeBuilder<DeliveryZone> builder)
    {
        builder.ToTable("delivery_zones");
        builder.HasKey(dz => dz.Id);
        builder.HasIndex(dz => new { dz.Province, dz.District }).IsUnique();
        builder.Property(dz => dz.Province).HasMaxLength(64).IsRequired();
        builder.Property(dz => dz.District).HasMaxLength(64).IsRequired();
    }
}

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("orders");
        builder.HasKey(o => o.Id);
        builder.HasIndex(o => o.OrderNumber).IsUnique();

        builder.Property(o => o.OrderNumber).HasMaxLength(32).IsRequired();
        builder.Property(o => o.CustomerName).HasMaxLength(128).IsRequired();
        builder.Property(o => o.CustomerEmail).HasMaxLength(256).IsRequired();
        builder.Property(o => o.CustomerPhone).HasMaxLength(32).IsRequired();
        builder.Property(o => o.DeliveryMethod).HasConversion<string>().HasMaxLength(32).IsRequired();
        builder.Property(o => o.PaymentMethod).HasConversion<string>().HasMaxLength(32).IsRequired();
        builder.Property(o => o.PaymentStatus).HasConversion<string>().HasMaxLength(32).IsRequired();
        builder.Property(o => o.OrderStatus).HasConversion<string>().HasMaxLength(32).IsRequired();

        builder.Property(o => o.ShippingProvince).HasMaxLength(64).IsRequired();
        builder.Property(o => o.ShippingDistrict).HasMaxLength(64).IsRequired();
        builder.Property(o => o.ShippingMunicipality).HasMaxLength(128).IsRequired();
        builder.Property(o => o.ShippingWard).HasMaxLength(16).IsRequired();
        builder.Property(o => o.ShippingStreet).HasMaxLength(256).IsRequired();
        builder.Property(o => o.ShippingLandmark).HasMaxLength(256).IsRequired();
    }
}

public class BrandSettingsConfiguration : IEntityTypeConfiguration<BrandSettings>
{
    public void Configure(EntityTypeBuilder<BrandSettings> builder)
    {
        builder.ToTable("brand_settings");
        builder.HasKey(bs => bs.Id);
        builder.Property(bs => bs.BrandName).HasMaxLength(128).IsRequired();
        builder.Property(bs => bs.ContactEmail).HasMaxLength(256).IsRequired();
        builder.Property(bs => bs.ContactPhone).HasMaxLength(32).IsRequired();
    }
}

public class PaymentGatewaySettingsConfiguration : IEntityTypeConfiguration<PaymentGatewaySettings>
{
    public void Configure(EntityTypeBuilder<PaymentGatewaySettings> builder)
    {
        builder.ToTable("payment_gateway_settings");
        builder.HasKey(pg => pg.Id);
    }
}
