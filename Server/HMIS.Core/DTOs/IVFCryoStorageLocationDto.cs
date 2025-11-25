namespace HMIS.Core.DTOs
{
    public class IVFCryoStorageLocationDto
    {
        public long ContainerId { get; set; }
        public string ContainerDescription { get; set; } = string.Empty;
        public string CanisterCode { get; set; } = string.Empty;
        public string CaneCode { get; set; } = string.Empty;
        public int StrawPosition { get; set; }
        public string StorageLocation => $"{ContainerDescription}-{CanisterCode}-{CaneCode}-{StrawPosition}";
        public bool IsAvailable { get; set; }
        public string? CurrentPatientName { get; set; }
        public int? CurrentSampleCount { get; set; }
    }

    public class NextAvailableSlotDto
    {
        public long ContainerId { get; set; }
        public string ContainerDescription { get; set; } = string.Empty;
        public string CanisterCode { get; set; } = string.Empty;
        public string CaneCode { get; set; } = string.Empty;
        public int StrawPosition { get; set; }
        public string StorageLocation => $"{ContainerDescription}-{CanisterCode}-{CaneCode}-{StrawPosition}";
        public int FreePlaces { get; set; }
        public long? LevelCId { get; set; }
    }

    public class CryoStorageDetailDto
    {
        public string Color1 { get; set; }
        public string Color2 { get; set; }
        public string PatientName { get; set; }
        public string PatientId { get; set; }
        public string StrawId { get; set; }
        public string Position { get; set; }
        public string TypeOfMaterial { get; set; }
        public string Description { get; set; }
        public string LevelA { get; set; }
        public string LevelB { get; set; }
    }

    public class CryoStorageDetailRequestDto
    {
        public long LevelCId { get; set; }
    }
}
