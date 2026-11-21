using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ClothingStore.Application.Common.Interfaces;
using ClothingStore.Infrastructure.Email;
using ClothingStore.Infrastructure.Identity;
using ClothingStore.Infrastructure.Persistence;
using ClothingStore.Infrastructure.Services;
using ClothingStore.Infrastructure.Storage;

namespace ClothingStore.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Host=localhost;Database=MaisonVeraDb;Username=postgres;Password=postgres;Port=5432;";

        services.AddDbContext<MaisonVeraDbContext>((sp, options) =>
        {
            options.UseNpgsql(connectionString, npgsqlOptions =>
            {
                npgsqlOptions.MigrationsAssembly(typeof(MaisonVeraDbContext).Assembly.FullName);
                npgsqlOptions.EnableRetryOnFailure(maxRetryCount: 3, maxRetryDelay: TimeSpan.FromSeconds(5), errorCodesToAdd: null);
            });
        });

        services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<MaisonVeraDbContext>());

        // Identity & Security
        services.AddSingleton<IPasswordHasher, Argon2PasswordHasher>();
        services.AddScoped<IJwtService, JwtService>();

        // Storage & Communications
        services.AddHttpClient<IFileStorageService, SupabaseStorageService>();
        services.AddHttpClient<IEmailService, ResendEmailService>();

        // Domain Services
        services.AddScoped<INepalDeliveryTariffCalculator, NepalDeliveryTariffCalculator>();

        return services;
    }
}
