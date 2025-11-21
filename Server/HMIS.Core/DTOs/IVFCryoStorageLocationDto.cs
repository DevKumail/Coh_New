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
    }
}
