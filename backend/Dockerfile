# Multi-stage Dockerfile for MAISON VÉRA ASP.NET Core 8 Web API
# Optimized for Railway / Render / Azure App Service deployments

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY ["src/ClothingStore.Domain/ClothingStore.Domain.csproj", "src/ClothingStore.Domain/"]
COPY ["src/ClothingStore.Application/ClothingStore.Application.csproj", "src/ClothingStore.Application/"]
COPY ["src/ClothingStore.Infrastructure/ClothingStore.Infrastructure.csproj", "src/ClothingStore.Infrastructure/"]
COPY ["src/ClothingStore.Api/ClothingStore.Api.csproj", "src/ClothingStore.Api/"]

RUN dotnet restore "src/ClothingStore.Api/ClothingStore.Api.csproj"

# Copy entire source tree and publish
COPY . .
WORKDIR "/src/src/ClothingStore.Api"
RUN dotnet publish "ClothingStore.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Expose standard ASP.NET Core container ports
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=build /app/publish .

# Health Check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["dotnet", "ClothingStore.Api.dll"]
