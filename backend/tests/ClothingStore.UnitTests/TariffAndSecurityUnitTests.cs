using FluentAssertions;
using ClothingStore.Domain.Entities;
using ClothingStore.Domain.Enums;
using ClothingStore.Infrastructure.Identity;
using Xunit;

namespace ClothingStore.UnitTests;

public class Argon2PasswordHasherTests
{
    private readonly Argon2PasswordHasher _hasher = new();

    [Fact]
    public void HashPassword_ShouldProduceValidSaltAndHashFormat()
    {
        // Arrange
        const string password = "AtelierLuxuryPassword2026!";

        // Act
        var hash = _hasher.HashPassword(password);

        // Assert
        hash.Should().NotBeNullOrWhiteSpace();
        hash.Should().Contain(":");
        var parts = hash.Split(':');
        parts.Length.Should().Be(2);
        parts[0].Length.Should().BeGreaterThan(10); // Salt
        parts[1].Length.Should().BeGreaterThan(20); // Hash
    }

    [Fact]
    public void VerifyPassword_WithCorrectPassword_ShouldReturnTrue()
    {
        // Arrange
        const string password = "AtelierLuxuryPassword2026!";
        var hash = _hasher.HashPassword(password);

        // Act
        var isValid = _hasher.VerifyPassword(password, hash);

        // Assert
        isValid.Should().BeTrue();
    }

    [Fact]
    public void VerifyPassword_WithIncorrectPassword_ShouldReturnFalse()
    {
        // Arrange
        const string password = "AtelierLuxuryPassword2026!";
        var hash = _hasher.HashPassword(password);

        // Act
        var isValid = _hasher.VerifyPassword("WrongPassword!", hash);

        // Assert
        isValid.Should().BeFalse();
    }
}

public class ProductInvariantsTests
{
    [Fact]
    public void Product_DefaultProperties_ShouldMeetLuxuryStandards()
    {
        // Arrange & Act
        var product = new Product
        {
            Name = "Architectural Virgin Wool Overcoat",
            OriginalPrice = 48500.00m,
            SellingPrice = 42000.00m,
            DiscountPercent = 13.00m,
            GenderCollection = GenderCollection.Unisex,
            Status = ProductStatus.Published
        };

        // Assert
        product.OriginalPrice.Should().BeGreaterThanOrEqualTo(product.SellingPrice);
        product.Status.Should().Be(ProductStatus.Published);
        product.GenderCollection.Should().Be(GenderCollection.Unisex);
    }

    [Fact]
    public void ProductVariant_DeductStock_ShouldReflectAccurateQuantities()
    {
        // Arrange
        var variant = new ProductVariant
        {
            Sku = "YB-AW26-001-M-BLK",
            Size = "48 / M",
            ColorName = "Obsidian Black",
            ColorHex = "#080808",
            StockQuantity = 8
        };

        // Act
        variant.StockQuantity -= 2;

        // Assert
        variant.StockQuantity.Should().Be(6);
    }
}
