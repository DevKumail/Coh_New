using HMIS.Core.Context;
using HMIS.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace HMIS.Core.FileSystem
{
    public interface IFileRepository : IDisposable
    {
        Task<HmisFiles> CreateAsync(string fileName, string moduleName, string mimeType, Stream data);
        Task<HmisFiles> GetAsync(long id);
        Task<bool> DeleteAsync(long id);
        Task<string> GetFilePathAsync(long id);
    }
    public class FileRepository : IFileRepository
    {
        private readonly HMISDbContext _context;
        private readonly IHostEnvironment _environment;
        private readonly ILogger<FileRepository> _logger;

        public FileRepository(HMISDbContext context, IHostEnvironment environment, ILogger<FileRepository> logger)
        {
            _context = context;
            _environment = environment;
            _logger = logger;
        }

        public async Task<HmisFiles> CreateAsync(string fileName, string moduleName, string mimeType, Stream data)
        {
            try
            {
                // Create module-specific folder if it doesn't exist
                var modulePath = Path.Combine(_environment.ContentRootPath, "UploadFiles", moduleName);
                if (!Directory.Exists(modulePath))
                {
                    Directory.CreateDirectory(modulePath);
                }

                var fileEntity = new HmisFiles
                {
                    FileName = fileName,
                    FilePath = modulePath,
                    DocumentType = mimeType,
                    FileSize = data.Length,
                    CreatedBy = null,
                    CreatedAt = DateTime.Now
                };

                _context.HmisFiles.Add(fileEntity);
                await _context.SaveChangesAsync();

                // Save physical file
                var physicalFilePath = Path.Combine(modulePath, fileEntity.Id.ToString());
                using (var fileStream = new FileStream(physicalFilePath, FileMode.Create))
                {
                    await data.CopyToAsync(fileStream);
                }

                return fileEntity;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating file {FileName}", fileName);
                throw;
            }
        }

        public async Task<HmisFiles> GetAsync(long id)
        {
            return await _context.HmisFiles
                .Where(f => f.Id == id && !f.IsDeleted)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var fileEntity = await _context.HmisFiles.FindAsync(id);
            if (fileEntity == null) return false;

            // Soft delete
            fileEntity.IsDeleted = true;
            fileEntity.DeletedBy = null;
            await _context.SaveChangesAsync();

            var physicalFilePath = Path.Combine(fileEntity.FilePath, fileEntity.Id.ToString());

            if (File.Exists(physicalFilePath))
            {
                File.Delete(physicalFilePath);
            }

            return true;
        }

        public async Task<string> GetFilePathAsync(long id)
        {
            var fileEntity = await _context.HmisFiles.FindAsync(id);
            if (fileEntity == null || fileEntity.IsDeleted)
                return null;

            return Path.Combine(fileEntity.FilePath, fileEntity.Id.ToString());
        }


        public void Dispose()
        {
            _context?.Dispose();
        }
    }

}






