namespace HMIS.Application.DTOs.CryoDTOs
{
    // Dropdown DTOs
    public class CryoDropDownDto
    {
        public long Value { get; set; }
        public string Label { get; set; } = string.Empty;
    }

    public class CryoSearchRequestDto
    {
        public long? ContainerId { get; set; }
        public long? LevelAId { get; set; }
        public long? LevelBId { get; set; }
        public int? MinFreePositions { get; set; }
        public int? MaxPatients { get; set; }
        public int? MaxSamples { get; set; }
        public string? StrawId { get; set; }
    }

    public class CryoStorageListDto
    {
        public string Description { get; set; } = string.Empty;
        public string Canister { get; set; } = string.Empty;
        public string Goblet { get; set; } = string.Empty;
        public int PatientCount { get; set; }
        public int SampleCount { get; set; }
        public int FreePlaces { get; set; }
        public string? StrawId { get; set; }
    }
}
