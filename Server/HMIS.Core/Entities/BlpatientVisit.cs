using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BLPatientVisit")]
public partial class BlpatientVisit
{
    [Key]
    public long VisitAccountNo { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? VisitAccDisplay { get; set; }

    public long? AppointmentId { get; set; }

    [Column(TypeName = "money")]
    public decimal Copay { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime LastUpdatedDate { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string LastUpdatedBy { get; set; } = null!;

    [StringLength(300)]
    [Unicode(false)]
    public string? ChargeCaptureComments { get; set; }

    public bool IsSelfPay { get; set; }

    public bool? IsPatientResponsible { get; set; }

    public Guid? EncounterId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? IsPatientResponsibleDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? IsSelfPayDate { get; set; }

    public int? ProvRemId { get; set; }

    public Guid? CaseId { get; set; }

    public int? VisitTypeId { get; set; }

    public bool? IsInvoiceGenerated { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? InvoiceNo { get; set; }

    [Column("SUB_CASE_NO")]
    [StringLength(50)]
    [Unicode(false)]
    public string? SubCaseNo { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? SpecialDiscount { get; set; }

    public bool? IsPrinted { get; set; }

    public bool? IsSave { get; set; }

    public long? PayerId { get; set; }

    public long? SubscriberId { get; set; }

    public int? MergedStatus { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? SpecialDiscountAmount { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? DiscountType { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? DiscountAuthorizeBy { get; set; }

    public bool? CodingFinalized { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? CodingFinalizedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CodingFinalizedDate { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Discount { get; set; }

    [StringLength(150)]
    [Unicode(false)]
    public string? Reason { get; set; }

    public bool? CodingReviewed { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? CodingReviewedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CodingReviewedDate { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? CodingReviewedRemarks { get; set; }

    public bool? NonBillable { get; set; }

    public long? InvoiceGeneratedById { get; set; }

    [Column("RegisteredToHIE")]
    public bool? RegisteredToHie { get; set; }

    public bool? IsConsultationVisit { get; set; }

    [Column("labrefno")]
    [StringLength(20)]
    [Unicode(false)]
    public string? Labrefno { get; set; }

    [Column("RefFacilityMRN")]
    [StringLength(20)]
    [Unicode(false)]
    public string? RefFacilityMrn { get; set; }

    [Column("RefFacilityEncounterID")]
    [StringLength(20)]
    [Unicode(false)]
    public string? RefFacilityEncounterId { get; set; }

    public int? EligibilityId { get; set; }

    [Column("ELRequestStatusId")]
    public byte? ElrequestStatusId { get; set; }

    [Column("ELStatusId")]
    public byte? ElstatusId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? EligibilityNo { get; set; }

    public bool? IsDeleted { get; set; }

    [ForeignKey("AppointmentId")]
    [InverseProperty("BlpatientVisit")]
    public virtual SchAppointment? Appointment { get; set; }

    [InverseProperty("VisitAccountNoNavigation")]
    public virtual ICollection<Ivfmain> Ivfmain { get; set; } = new List<Ivfmain>();

    [ForeignKey("PayerId")]
    [InverseProperty("BlpatientVisit")]
    public virtual Blpayer? Payer { get; set; }

    [ForeignKey("SubscriberId")]
    [InverseProperty("BlpatientVisit")]
    public virtual InsuredSubscriber? Subscriber { get; set; }
}
