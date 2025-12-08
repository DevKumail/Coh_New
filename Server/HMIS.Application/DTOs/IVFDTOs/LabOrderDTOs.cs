using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace HMIS.Application.DTOs.IVFDTOs
{
    public enum LabOrderStatus
    {
        New = 1,
        InProgress = 2,
        SampleCollected = 3,
        Completed = 4,
        Cancel = 5

    }

    public class LabOrderSetHeaderDTO
    {
        public long OrderSetId { get; set; }
        public long MRNo { get; set; }
        public int ProviderId { get; set; }
        public DateTime OrderDate { get; set; }
        public long? VisitAccountNo { get; set; }
        public long CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public long? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? OrderControlCode { get; set; }
        public string? OrderStatus { get; set; }
        public LabOrderStatus? OrderStatusEnum { get; set; }
        public bool? IsHL7MsgCreated { get; set; }
        public bool? IsHL7MessageGeneratedForPhilips { get; set; }
        public bool? IsSigned { get; set; }
        public string? oldMRNo { get; set; }
        public long? HL7MessageId { get; set; }
        public long? OrderNumber { get; set; }
        public int? SampleTypeId { get; set; }
        public string? SampleTypeName { get; set; }
        public long? OverviewId { get; set; }
    }

    public class LabOrderSetDetailDTO
    {
        public long OrderSetDetailId { get; set; }
        public long OrderSetId { get; set; }
        public long LabTestId { get; set; }
        public string? CPTCode { get; set; }
        public string? PComments { get; set; }
        public int OrderQuantity { get; set; }
        public Guid? SendToLabId { get; set; }
        public int? IsRadiologyTest { get; set; }
        public bool? IsInternalTest { get; set; }
        public string? RadiologySide { get; set; }
        public long? ProfileLabTestID { get; set; }
        public long? VisitOrderNo { get; set; }
        public string? ResultExpectedDate { get; set; }
        public string? ReferralName { get; set; }
        public long? ReferralId { get; set; }
        public string? SignedDate { get; set; }
        public string? ReferralTo { get; set; }
        public string? CancelComments { get; set; }
        public int? InvestigationTypeId { get; set; }
        public long? OldOrderDetailId { get; set; }
        public string? RescheduledTo { get; set; }
        public int? BillOnOrder { get; set; }
        public bool? IsDeleted { get; set; }
        public string? CollectDate { get; set; }
        public string? Status { get; set; }
        public string? PerformDate { get; set; }
    }

    // Payload for create/update
    public class CreateUpdateLabOrderSetDTO
    {
        public LabOrderSetHeaderDTO Header { get; set; }
        public List<LabOrderSetDetailDTO> Details { get; set; } = new();
    }

    public class LabOrderSetReadDTO
    {
        public LabOrderSetHeaderDTO Header { get; set; }
        public List<LabOrderSetDetailDTO> Details { get; set; } = new();
    }

    public class CollectSampleDTO
    {
        public DateTime CollectDate { get; set; }
        public long UserId { get; set; }
    }

    public class LabResultObservationDTO
    {
        public string ValueType { get; set; }
        public string ObservationIdentifierFullName { get; set; }
        public string? ObservationIdentifierShortName { get; set; }
        public string ObservationValue { get; set; }
        public string? Units { get; set; }
        public string? ReferenceRangeMin { get; set; }
        public string? ReferenceRangeMax { get; set; }
        public string? AbnormalFlag { get; set; }
        public string ResultStatus { get; set; }
        public DateTime? ObservationDateTime { get; set; }
        public DateTime? AnalysisDateTime { get; set; }
        public string? Remarks { get; set; }
        public bool? WeqayaScreening { get; set; }
        public int? SequenceNo { get; set; }
    }

    public class CompleteLabOrderDTO
    {
        public DateTime PerformDate { get; set; }
        public DateTime EntryDate { get; set; }
        public long UserId { get; set; }
        public string? AccessionNumber { get; set; }
        public bool? IsDefault { get; set; }
        public long? PrincipalResultInterpreter { get; set; }
        public string? Action { get; set; }
        public string? ReviewedBy { get; set; }
        public DateTime? ReviewedDate { get; set; }
        public int? PerformAtLabId { get; set; }
        public string? Note { get; set; }
        public List<LabResultObservationDTO>? Observations { get; set; } = new();
        public List<AttachmentDTO>? Attachments { get; set; } = new();

    }

    public class OrderCollectionDetailsDTO
    {
        public long OrderSetDetailId { get; set; }
        public long LabTestId { get; set; }
        public string TestName { get; set; }
        public string Material { get; set; }
        public string Status { get; set; }
    }

    public class LabOrderCompleteResultDto
    {
        public long? OrderSetDetailId { get; set; }
        public long LabTestId { get; set; }
        public string TestName { get; set; }
        public string Material { get; set; }
        public string Status { get; set; }
        public DateTime? PerformDate { get; set; }
        public DateTime? EntryDate { get; set; }
        public int UserId { get; set; }
        public string? AccessionNumber { get; set; }
        public bool? IsDefault { get; set; }
        public long? PrincipalResultInterpreter { get; set; }
        public string? Action { get; set; }
        public string? ReviewedBy { get; set; }
        public DateTime? ReviewedDate { get; set; }
        public int? PerformAtLabId { get; set; }
        public string? Note { get; set; }
        public List<AttachmentDTO>? Attachments { get; set; } = new();
    }

    public class PathologyObservationDTO
    {
        public int? SequenceNo { get; set; }
        public string? Observation { get; set; }
        public string? Abbreviation { get; set; }
        public string? Value { get; set; }
        public string? Unit { get; set; }
        public string? ReferenceRangeMin { get; set; }
        public string? ReferenceRangeMax { get; set; }
        public string? Status { get; set; }
        public string? Note { get; set; }
    }

    public class PathologyResultDTO
    {
        public int LabResultId { get; set; }
        public long? OrderSetDetailId { get; set; }
        public long MRNo { get; set; }
        public DateTime PerformDate { get; set; }
        public string? TestName { get; set; }
        public string? TestAbbreviation { get; set; }
        public string? CptCode { get; set; }
        public string? Sample { get; set; }
        public string? Clinician { get; set; }
        public List<PathologyObservationDTO> Observations { get; set; } = new();
    }

    public class CancelOrderDTO
    {
        public long UserId { get; set; }
        public DateTime CancelDate { get; set; }
    }
    public class AttachmentDTO
    {
        public long FileId { get; set; }
        public string? FilePath { get; set; }
        public IFormFile? FormFile { get; set; } 

    }
}
