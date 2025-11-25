using Microsoft.AspNetCore.Mvc;
using HMIS.Core.FileSystem;
using HMIS.Application.DTOs;
using HMIS.Infrastructure.Helpers;
using HMIS.Core.Entities;
using Microsoft.AspNetCore.Authorization;

namespace HMIS.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class RsUploadController : BaseApiController
    {
        private readonly IFileRepository _fileRepository;
        private readonly FileHelper _fileHelper;
        private readonly ILogger<RsUploadController> _logger;

        public RsUploadController(IFileRepository fileRepository, FileHelper fileHelper,
                                ILogger<RsUploadController> logger)
        {
            _fileRepository = fileRepository;
            _fileHelper = fileHelper;
            _logger = logger;
        }

        [HttpPost("upload")]
        public async Task<ActionResult<UploadResponse>> UploadFile([FromForm] string moduleName, IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file uploaded");

                if (string.IsNullOrEmpty(moduleName))
                    return BadRequest("Module name is required");

                // Ensure module directory exists
                _fileHelper.EnsureModuleDirectoryExists(moduleName);

                HmisFiles fileEntity;
                using (var stream = file.OpenReadStream())
                {
                    fileEntity = await _fileRepository.CreateAsync(
                        fileName: file.FileName,
                        moduleName: moduleName,
                        mimeType: file.ContentType,
                        data: stream
                    );
                }

                var response = new UploadResponse
                {
                    FileId = fileEntity.Id,
                    FileName = fileEntity.FileName,
                    FileSize = fileEntity.FileSize ?? 0
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file for module {ModuleName}", moduleName);
                return StatusCode(500, "Error uploading file");
            }
        }

        [HttpPost("upload-multiple")]
        public async Task<ActionResult<List<UploadResponse>>> UploadMultipleFiles([FromForm] string moduleName, List<IFormFile> files)
        {
            try
            {
                if (files == null || files.Count == 0)
                    return BadRequest("No files uploaded");

                if (string.IsNullOrEmpty(moduleName))
                    return BadRequest("Module name is required");

                // Ensure module directory exists
                _fileHelper.EnsureModuleDirectoryExists(moduleName);

                var responses = new List<UploadResponse>();

                foreach (var file in files)
                {
                    if (file.Length == 0) continue;

                    HmisFiles fileEntity;
                    using (var stream = file.OpenReadStream())
                    {
                        fileEntity = await _fileRepository.CreateAsync(
                            fileName: file.FileName,
                            moduleName: moduleName,
                            mimeType: file.ContentType,
                            data: stream
                        );
                    }

                    responses.Add(new UploadResponse
                    {
                        FileId = fileEntity.Id,
                        FileName = fileEntity.FileName,
                        FileSize = fileEntity.FileSize ?? 0
                    });
                }

                return Ok(responses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading multiple files for module {ModuleName}", moduleName);
                return StatusCode(500, "Error uploading files");
            }
        }

        [HttpGet("download/{fileId}")]
        public async Task<IActionResult> DownloadFile(long fileId)
        {
            try
            {
                var fileEntity = await _fileRepository.GetAsync(fileId);
                if (fileEntity == null)
                    return NotFound("File not found");

                var filePath = await _fileRepository.GetFilePathAsync(fileId);
                if (!_fileHelper.FileExists(filePath))
                    return NotFound("Physical file not found");

                var fileBytes = await _fileHelper.GetFileContentAsync(filePath);
                return File(fileBytes, fileEntity.DocumentType, fileEntity.FileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading file {FileId}", fileId);
                return StatusCode(500, "Error downloading file");
            }
        }

        [HttpDelete("delete/{fileId}")]
        public async Task<IActionResult> DeleteFile(long fileId)
        {
            try
            {
                var success = await _fileRepository.DeleteAsync(fileId);
                if (!success)
                    return NotFound("File not found");

                return Ok(new { message = "File deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file {FileId}", fileId);
                return StatusCode(500, "Error deleting file");
            }
        }

        [HttpGet("info/{fileId}")]
        public async Task<ActionResult<UploadResponse>> GetFileInfo(long fileId)
        {
            try
            {
                var fileEntity = await _fileRepository.GetAsync(fileId);
                if (fileEntity == null)
                    return NotFound("File not found");

                var response = new UploadResponse
                {
                    FileId = fileEntity.Id,
                    FileName = fileEntity.FileName,
                    FileSize = fileEntity.FileSize ?? 0
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting file info {FileId}", fileId);
                return StatusCode(500, "Error getting file information");
            }
        }
    }
}