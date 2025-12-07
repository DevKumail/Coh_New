using Microsoft.AspNetCore.Http;

namespace HMIS.Application.DTOs
{
    public class UploadRequestModel
    {
        public string ModuleName { get; set; }
    }

    public class UploadResponse
    {
        public long FileId { get; set; }
        public string FileName { get; set; }
        public long FileSize { get; set; }
    }
    public class GetFileResponse
    {
        public long FileId { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public byte[] Content { get; set; }
    }
}
