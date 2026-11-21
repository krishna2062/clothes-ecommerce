using Microsoft.EntityFrameworkCore;
using ClothingStore.Application.Common.Interfaces;
using ClothingStore.Domain.Entities;
using ClothingStore.Domain.Enums;

namespace ClothingStore.Infrastructure.Services;

public interface INepalDeliveryTariffCalculator
{
    Task<(decimal Tariff, string EstimatedTime)> CalculateTariffAsync(
        string province,
        string district,
        DeliveryMethodType method,
        decimal subtotal,
        CancellationToken cancellationToken = default);
}

public class NepalDeliveryTariffCalculator : INepalDeliveryTariffCalculator
{
    private readonly IApplicationDbContext _context;

    public NepalDeliveryTariffCalculator(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<(decimal Tariff, string EstimatedTime)> CalculateTariffAsync(
        string province,
        string district,
        DeliveryMethodType method,
        decimal subtotal,
        CancellationToken cancellationToken = default)
    {
        var brandSettings = await _context.BrandSettings.FirstOrDefaultAsync(cancellationToken) ?? new BrandSettings();

        // Check if global free shipping threshold is reached (e.g. NPR 10,000)
        if (method == DeliveryMethodType.Standard && subtotal >= brandSettings.FreeShippingThreshold)
        {
            return (0.00m, "1-2 Business Days (Complimentary)");
        }

        var normalizedDistrict = district.Trim().ToLowerInvariant();
        var normalizedProvince = province.Trim().ToLowerInvariant();

        var zone = await _context.DeliveryZones
            .AsNoTracking()
            .Where(z => z.Active)
            .FirstOrDefaultAsync(z =>
                z.District.ToLower() == normalizedDistrict ||
                z.Province.ToLower() == normalizedProvince,
                cancellationToken);

        if (zone != null)
        {
            var charge = method == DeliveryMethodType.Express ? zone.ExpressCharge : zone.StandardCharge;
            return (charge, zone.EstimatedTime);
        }

        // Default Kathmandu Valley fallback
        var isKathmanduValley = normalizedDistrict.Contains("kathmandu") ||
                                normalizedDistrict.Contains("lalitpur") ||
                                normalizedDistrict.Contains("bhaktapur");

        if (isKathmanduValley)
        {
            return method == DeliveryMethodType.Express
                ? (150.00m, "Same Day (Within 6 Hours)")
                : (0.00m, "1-2 Business Days (Complimentary)");
        }

        // Standard outside valley tariff
        return method == DeliveryMethodType.Express
            ? (300.00m, "24-48 Hours")
            : (150.00m, "2-3 Business Days");
    }
}
