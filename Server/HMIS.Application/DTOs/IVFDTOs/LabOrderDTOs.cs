using System;
using System.Collections.Generic;

namespace HMIS.Application.DTOs.IVFDTOs
{
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
        public bool? IsHL7MsgCreated { get; set; }
        public bool? IsHL7MessageGeneratedForPhilips { get; set; }
        public bool? IsSigned { get; set; }
        public string? oldMRNo { get; set; }
        public long? HL7MessageId { get; set; }
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
}
