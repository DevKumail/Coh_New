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
}
