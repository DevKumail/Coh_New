using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.IO;

namespace HMIS.Infrastructure.Helpers
{
    public class FileHelper
    {
        private readonly IHostEnvironment _environment;
        private readonly ILogger<FileHelper> _logger;

        public FileHelper(IHostEnvironment environment, ILogger<FileHelper> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        public void EnsureModuleDirectoryExists(string moduleName)
        {
            var modulePath = Path.Combine(_environment.ContentRootPath, "UploadFiles", moduleName);
            if (!Directory.Exists(modulePath))
            {
                Directory.CreateDirectory(modulePath);
                _logger.LogInformation("Created directory for module: {ModuleName}", moduleName);
            }
        }

        public async Task SaveFileAsync(Stream data, string filePath)
        {
            try
            {
                var directory = Path.GetDirectoryName(filePath);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await data.CopyToAsync(fileStream);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving file to {FilePath}", filePath);
                throw;
            }
        }

        public async Task<byte[]> GetFileContentAsync(string filePath)
        {
            if (!File.Exists(filePath))
                throw new FileNotFoundException($"File not found: {filePath}");

            return await File.ReadAllBytesAsync(filePath);
        }

        public bool FileExists(string filePath)
        {
            var normalizedPath = Path.GetFullPath(filePath);
            return File.Exists(normalizedPath);
        }

        public bool DeleteFile(string filePath)
        {
            if (!File.Exists(filePath)) return false;

            File.Delete(filePath);
            return true;
        }
    }
}
