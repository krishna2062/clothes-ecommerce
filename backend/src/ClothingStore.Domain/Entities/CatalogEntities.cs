using ClothingStore.Domain.Common;
using ClothingStore.Domain.Enums;

namespace ClothingStore.Domain.Entities;

public class Category : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public Guid? ParentCategoryId { get; set; }
    public int SortOrder { get; set; } = 0;
    public CategoryStatus Status { get; set; } = CategoryStatus.Active;

    public virtual Category? ParentCategory { get; set; }
    public virtual ICollection<Category> SubCategories { get; set; } = new List<Category>();
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}

public class Collection : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string BannerImageUrl { get; set; } = string.Empty;
    public bool Featured { get; set; } = false;
    public int SortOrder { get; set; } = 0;
    public CollectionStatus Status { get; set; } = CollectionStatus.Active;

    public virtual ICollection<CollectionProduct> CollectionProducts { get; set; } = new List<CollectionProduct>();
}

public class CollectionProduct
{
    public Guid CollectionId { get; set; }
    public Guid ProductId { get; set; }
    public int DisplayOrder { get; set; } = 0;

    public virtual Collection Collection { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
}

public class Product : AuditableEntity
{
    public string Slug { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> MaterialsAndCare { get; set; } = new();
    public string ShippingInfo { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public GenderCollection GenderCollection { get; set; } = GenderCollection.Unisex;
    public string? CollectionTag { get; set; }
    public decimal OriginalPrice { get; set; }
    public decimal SellingPrice { get; set; }
    public decimal DiscountPercent { get; set; } = 0.00m;
    public string MainImageUrl { get; set; } = string.Empty;
    public bool Featured { get; set; } = false;
    public bool NewArrival { get; set; } = false;
    public bool BestSeller { get; set; } = false;
    public bool OnSale { get; set; } = false;
    public ProductStatus Status { get; set; } = ProductStatus.Published;
    public int TotalStock { get; set; } = 0;
    public Guid ConcurrencyToken { get; set; } = Guid.NewGuid();

    public virtual Category Category { get; set; } = null!;
    public virtual ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public virtual ICollection<ProductSize> Sizes { get; set; } = new List<ProductSize>();
    public virtual ICollection<ProductColor> Colors { get; set; } = new List<ProductColor>();
    public virtual ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
    public virtual ICollection<CollectionProduct> CollectionProducts { get; set; } = new List<CollectionProduct>();
    public virtual ICollection<ProductReview> Reviews { get; set; } = new List<ProductReview>();
}

public class ProductImage : BaseEntity
{
    public Guid ProductId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int DisplayOrder { get; set; } = 0;
    public string AltText { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public virtual Product Product { get; set; } = null!;
}

public class ProductSize : BaseEntity
{
    public Guid ProductId { get; set; }
    public string SizeName { get; set; } = string.Empty;
    public int DisplayOrder { get; set; } = 0;

    public virtual Product Product { get; set; } = null!;
}

public class ProductColor : BaseEntity
{
    public Guid ProductId { get; set; }
    public string ColorName { get; set; } = string.Empty;
    public string HexCode { get; set; } = string.Empty;

    public virtual Product Product { get; set; } = null!;
}

public class ProductVariant : BaseEntity
{
    public Guid ProductId { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string ColorName { get; set; } = string.Empty;
    public string ColorHex { get; set; } = string.Empty;
    public int StockQuantity { get; set; } = 0;
    public int LowStockThreshold { get; set; } = 2;
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public virtual Product Product { get; set; } = null!;
    public virtual ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
}

public class StockMovement : BaseEntity
{
    public Guid ProductId { get; set; }
    public Guid VariantId { get; set; }
    public string Sku { get; set; } = string.Empty;
    public int ChangeDelta { get; set; }
    public int BalanceAfter { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string? ReferenceId { get; set; }
    public Guid PerformedBy { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public virtual Product Product { get; set; } = null!;
    public virtual ProductVariant Variant { get; set; } = null!;
}
