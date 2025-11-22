namespace HMIS.Application.DTOs.Configurations
{
    public class DropDownCategoryDto
    {
        public long? CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public long? CreatedBy { get; set; }
        public long? UpdatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class DropDownConfigurationDto
    {
        public long? ValueId { get; set; }
        public long CategoryId { get; set; }
        public string ValueName { get; set; } = string.Empty;
        public int? SortOrder { get; set; }
        public bool IsActive { get; set; } = true;
        public long? CreatedBy { get; set; }
        public long? UpdatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class DropDownCategoryWithValuesDto
    {
        public long CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<DropDownConfigurationDto> Values { get; set; } = new();
    }
}
