namespace HMIS.Core.DTOs
{
    public class IVFMaleCryoPreservationDto
    {
        public int CryoPreservationId { get; set; }
        public int SampleId { get; set; }
        public string PreservationCode { get; set; } = string.Empty;
        public DateTime FreezingDateTime { get; set; }
        public int? CryopreservedById { get; set; }
        public long? OriginallyFromClinicId { get; set; }
        public DateTime? StorageDateTime { get; set; }
        public int? StoredById { get; set; }
        public long? MaterialTypeId { get; set; }
        public int? StrawStartNumber { get; set; }
        public int? StrawCount { get; set; }
        public long? StatusId { get; set; }
        public int? CryoContractId { get; set; }
        public bool PreserveUsingCryoStorage { get; set; }
        public long? StoragePlaceId { get; set; }
        public string? Position { get; set; }
        public int? ColorId { get; set; }
        public bool ForResearch { get; set; }
        public long? ReasonForResearchId { get; set; }
        public string? Notes { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool? IsDeleted { get; set; }

        // Navigation properties
        public string? SampleCode { get; set; }
        public string? MaterialTypeName { get; set; }
        public string? StatusName { get; set; }
        public string? ColorCode { get; set; }
        public string? StorageLocation { get; set; }
    }

    public class IVFMaleCryoPreservationCreateDto
    {
        public int SampleId { get; set; }
        public string PreservationCode { get; set; } = string.Empty;
        public DateTime FreezingDateTime { get; set; }
        public int? CryopreservedById { get; set; }
        public long? OriginallyFromClinicId { get; set; }
        public DateTime? StorageDateTime { get; set; }
        public int? StoredById { get; set; }
        public long? MaterialTypeId { get; set; }
        public int? StrawStartNumber { get; set; }
        public int? StrawCount { get; set; }
        public long? StatusId { get; set; }
        public int? CryoContractId { get; set; }
        public bool PreserveUsingCryoStorage { get; set; }
        public long? StoragePlaceId { get; set; }
        public string? Position { get; set; }
        public int? ColorId { get; set; }
        public bool ForResearch { get; set; }
        public long? ReasonForResearchId { get; set; }
        public string? Notes { get; set; }
        public int? CreatedBy { get; set; }
    }

    public class IVFMaleCryoPreservationUpdateDto
    {
        public int CryoPreservationId { get; set; }
        public DateTime FreezingDateTime { get; set; }
        public int? CryopreservedById { get; set; }
        public long? OriginallyFromClinicId { get; set; }
        public DateTime? StorageDateTime { get; set; }
        public int? StoredById { get; set; }
        public long? MaterialTypeId { get; set; }
        public int? StrawStartNumber { get; set; }
        public int? StrawCount { get; set; }
        public long? StatusId { get; set; }
        public int? CryoContractId { get; set; }
        public bool PreserveUsingCryoStorage { get; set; }
        public long? StoragePlaceId { get; set; }
        public string? Position { get; set; }
        public int? ColorId { get; set; }
        public bool ForResearch { get; set; }
        public long? ReasonForResearchId { get; set; }
        public string? Notes { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
