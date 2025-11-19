namespace HMIS.Application.DTOs.CommonDTOs
{
    public class ICDFilterRequest
    {
        public string SearchKey { get; set; } = string.Empty;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 50;
        public string Type { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class ICDItemDto
    {
        public string ICDCode { get; set; } = string.Empty;
        public string DescriptionShort { get; set; } = string.Empty;
        public string DescriptionLong { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class ICDModel
    {
        public List<ICDItemDto> Items { get; set; } = new List<ICDItemDto>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }
}
