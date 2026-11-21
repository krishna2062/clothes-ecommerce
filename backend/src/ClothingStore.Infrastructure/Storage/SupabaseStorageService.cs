using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ClothingStore.Application.Common.Interfaces;

namespace ClothingStore.Infrastructure.Storage;

public class SupabaseStorageService : IFileStorageService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<SupabaseStorageService> _logger;

    public SupabaseStorageService(HttpClient httpClient, IConfiguration configuration, ILogger<SupabaseStorageService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<string> UploadFileAsync(Stream stream, string fileName, string contentType, string bucketName, CancellationToken cancellationToken = default)
    {
        var supabaseUrl = _configuration["Supabase:Url"]?.TrimEnd('/');
        var serviceRoleKey = _configuration["Supabase:ServiceRoleKey"];

        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        var uniqueFileName = $"{Guid.NewGuid():N}{extension}";
        var path = $"{DateTime.UtcNow:yyyy/MM}/{uniqueFileName}";

        if (string.IsNullOrEmpty(supabaseUrl) || string.IsNullOrEmpty(serviceRoleKey))
        {
            _logger.LogWarning("Supabase credentials not configured. Returning local mock URI for file: {FileName}", uniqueFileName);
            return $"/mock-storage/{bucketName}/{path}";
        }

        var endpoint = $"{supabaseUrl}/storage/v1/object/{bucketName}/{path}";
        using var request = new HttpRequestMessage(HttpMethod.Post, endpoint);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", serviceRoleKey);
        request.Headers.Add("apikey", serviceRoleKey);

        using var streamContent = new StreamContent(stream);
        streamContent.Headers.ContentType = new MediaTypeHeaderValue(contentType);
        request.Content = streamContent;

        var response = await _httpClient.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();

        if (bucketName == "product-images")
        {
            return $"{supabaseUrl}/storage/v1/object/public/{bucketName}/{path}";
        }

        // For private bucket, return the internal path (signed URL required to view)
        return path;
    }

    public async Task<string> GetSignedUrlAsync(string bucketName, string filePath, TimeSpan expiry)
    {
        var supabaseUrl = _configuration["Supabase:Url"]?.TrimEnd('/');
        var serviceRoleKey = _configuration["Supabase:ServiceRoleKey"];

        if (string.IsNullOrEmpty(supabaseUrl) || string.IsNullOrEmpty(serviceRoleKey))
        {
            return $"/mock-storage/signed/{bucketName}/{filePath}?expires=300";
        }

        var endpoint = $"{supabaseUrl}/storage/v1/object/sign/{bucketName}/{filePath}";
        using var request = new HttpRequestMessage(HttpMethod.Post, endpoint);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", serviceRoleKey);
        request.Headers.Add("apikey", serviceRoleKey);

        var payload = JsonSerializer.Serialize(new { expiresIn = (int)expiry.TotalSeconds });
        request.Content = new StringContent(payload, System.Text.Encoding.UTF8, "application/json");

        var response = await _httpClient.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Failed to create signed URL for {FilePath}: {StatusCode}", filePath, response.StatusCode);
            return string.Empty;
        }

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        if (doc.RootElement.TryGetProperty("signedURL", out var signedUrlElement))
        {
            return $"{supabaseUrl}/storage/v1{signedUrlElement.GetString()}";
        }

        return string.Empty;
    }

    public async Task DeleteFileAsync(string bucketName, string filePath, CancellationToken cancellationToken = default)
    {
        var supabaseUrl = _configuration["Supabase:Url"]?.TrimEnd('/');
        var serviceRoleKey = _configuration["Supabase:ServiceRoleKey"];

        if (string.IsNullOrEmpty(supabaseUrl) || string.IsNullOrEmpty(serviceRoleKey))
            return;

        var endpoint = $"{supabaseUrl}/storage/v1/object/{bucketName}/{filePath}";
        using var request = new HttpRequestMessage(HttpMethod.Delete, endpoint);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", serviceRoleKey);
        request.Headers.Add("apikey", serviceRoleKey);

        await _httpClient.SendAsync(request, cancellationToken);
    }
}
