namespace HMIS.Application.DTOs.IVFDTOs
{
    public class IVFStrawColorDto
    {
        public int ColorId { get; set; }
        public string ColorCode { get; set; } = string.Empty;
        public string? ColorDescription { get; set; }
        public int? SortOrder { get; set; }
        public bool IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsDeleted { get; set; }
    }

    public class IVFStrawColorCreateDto
    {
        public string ColorCode { get; set; } = string.Empty;
        public string? ColorDescription { get; set; }
        public int? SortOrder { get; set; }
        public bool IsActive { get; set; } = true;
        public int? CreatedBy { get; set; }
    }

    public class IVFStrawColorUpdateDto
    {
        public int ColorId { get; set; }
        public string ColorCode { get; set; } = string.Empty;
        public string? ColorDescription { get; set; }
        public int? SortOrder { get; set; }
        public bool IsActive { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
