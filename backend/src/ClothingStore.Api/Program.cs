using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using ClothingStore.Application.Common.Interfaces;
using ClothingStore.Api.Middleware;
using ClothingStore.Api.Services;
using ClothingStore.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// 1. Structured Logging with Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// 2. Add Infrastructure Services (DbContext, Npgsql, Argon2, JWT, Storage, Email)
builder.Services.AddInfrastructure(builder.Configuration);

// 3. Current User & Context
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

// 4. JWT Authentication
var jwtSecretKey = builder.Configuration["Jwt:SecretKey"] ?? "MaisonVeraSuperSecretLuxuryAtelierKey20261121MustBeAtLeast512BitsLongForSecurity!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "MaisonVeraApi";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "MaisonVeraClients";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Set to true in prod with proper certs
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// 5. Role-Based Authorization Policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireSuperAdmin", policy => policy.RequireRole("Super Admin"));
    options.AddPolicy("RequireAdmin", policy => policy.RequireRole("Super Admin", "Admin"));
    options.AddPolicy("CanManageCatalog", policy => policy.RequireRole("Super Admin", "Admin", "Product Manager"));
    options.AddPolicy("CanManageOrders", policy => policy.RequireRole("Super Admin", "Admin", "Order Manager"));
    options.AddPolicy("CanVerifyPayments", policy => policy.RequireRole("Super Admin", "Admin", "Payment Manager"));
    options.AddPolicy("CanModerateReviews", policy => policy.RequireRole("Super Admin", "Admin", "Customer Support"));
});

// 6. CORS Policy for Frontend Integration
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:5173", "http://localhost:3000", "https://krishna2062.github.io" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("MaisonVeraCorsPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// 7. Controllers & JSON Configuration
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// 8. Health Checks
builder.Services.AddHealthChecks();

// 9. Swagger / OpenAPI Configuration with Bearer Security Scheme
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MAISON VÉRA Luxury Fashion API",
        Version = "v1",
        Description = "Production REST API for MAISON VÉRA Luxury Minimal Fashion House. Built with ASP.NET Core 8 & PostgreSQL.",
        Contact = new OpenApiContact
        {
            Name = "Maison Véra Atelier",
            Email = "atelier@maisonvera.com",
            Url = new Uri("https://maisonvera.com")
        }
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT access token with the Bearer scheme. Example: \"Bearer eyJhbGciOi...\""
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment() || builder.Configuration.GetValue<bool>("Swagger:Enabled", false))
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MAISON VÉRA API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("MaisonVeraCorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

// Health Check Endpoint
app.MapHealthChecks("/health");

app.MapControllers();

// Fallback root endpoint
app.MapGet("/", () => Results.Ok(new
{
    brand = "MAISON VÉRA",
    status = "Operational",
    version = "1.0.0",
    environment = app.Environment.EnvironmentName,
    docs = "/swagger"
}));

// Automatic database migration & seeding when configured (e.g. Railway deploy)
if (app.Configuration.GetValue<bool>("ApplyMigrationsOnStartup", false))
{
    try
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ClothingStore.Infrastructure.Persistence.MaisonVeraDbContext>();
        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
        Log.Information("Applying pending database migrations...");
        await Microsoft.EntityFrameworkCore.RelationalDatabaseFacadeExtensions.MigrateAsync(dbContext.Database);
        Log.Information("Seeding initial catalog and system settings...");
        await ClothingStore.Infrastructure.Persistence.Seed.DbInitializer.InitializeAsync(dbContext, passwordHasher);
        Log.Information("Database migration and initialization completed successfully.");
    }
    catch (Exception ex)
    {
        Log.Error(ex, "An error occurred while migrating or seeding the database on startup.");
    }
}

app.Run();

// Required for WebApplicationFactory in integration tests
public partial class Program { }
