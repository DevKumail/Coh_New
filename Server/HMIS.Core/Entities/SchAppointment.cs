using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("SchAppointment")]
[Index("IsDeleted", "AppDateTime", "ProviderId", "FacilityId", "SiteId", "SpecialtyId", "LocationId", "AppStatusId", "AppCriteriaId", "VisitTypeId", Name = "IX_SchAppointment_Filters")]
public partial class SchAppointment
{
    [Key]
    public long AppId { get; set; }

    public long ProviderId { get; set; }

    [Column("MRNo")]
    [StringLength(10)]
    [Unicode(false)]
    public string Mrno { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime AppDateTime { get; set; }

    public int Duration { get; set; }

    [StringLength(400)]
    [Unicode(false)]
    public string? AppNote { get; set; }

    public int SiteId { get; set; }

    public int LocationId { get; set; }

    public int? AppTypeId { get; set; }

    public int? AppCriteriaId { get; set; }

    public int AppStatusId { get; set; }

    public int PatientStatusId { get; set; }

    public long? ReferredProviderId { get; set; }

    public bool IsPatientNotified { get; set; }

    public bool IsActive { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string EnteredBy { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime EntryDateTime { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DateTimeNotYetArrived { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DateTimeCheckIn { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DateTimeReady { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DateTimeSeen { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DateTimeBilled { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DateTimeCheckOut { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? UserNotYetArrived { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? UserCheckIn { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? UserReady { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? UserSeen { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? UserBilled { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? UserCheckOut { get; set; }

    [StringLength(250)]
    [Unicode(false)]
    public string? PurposeOfVisit { get; set; }

    public int? PatientNotifiedId { get; set; }

    public int? RescheduledId { get; set; }

    public bool? ByProvider { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string? PatientReportedProblem { get; set; }

    public int? RescheduleId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DateTimeChargeCapture { get; set; }

    [Column("SpecialtyID")]
    public int? SpecialtyId { get; set; }

    public long? Anesthesiologist { get; set; }

    [Column("CPTGroupID")]
    public long? CptgroupId { get; set; }

    [Column("oldMRNo")]
    [StringLength(20)]
    [Unicode(false)]
    public string? OldMrno { get; set; }

    public int? AppointmentClassification { get; set; }

    public int? VisitStatusId { get; set; }

    [Column("TelemedicineURL")]
    [StringLength(200)]
    public string? TelemedicineUrl { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? AppDate { get; set; }

    public int? FacilityId { get; set; }

    public long? VisitAccountNo { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? VisitAccDisplay { get; set; }

    [Column(TypeName = "money")]
    public decimal? Copay { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? LastUpdatedDate { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? LastUpdatedBy { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? ChargeCaptureComments { get; set; }

    public bool? IsSelfPay { get; set; }

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

    [Column(TypeName = "decimal(18, 0)")]
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

    public long? PurposeOfVisitId { get; set; }

    public bool? IsDeleted { get; set; }

    public long? PatientId { get; set; }

    public long? EmployeeId { get; set; }

    public long? PlanId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? PatientBalance { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? PlanBalance { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? PlanCopay { get; set; }

    [ForeignKey("AppCriteriaId")]
    [InverseProperty("SchAppointments")]
    public virtual SchAppointmentCriterion? AppCriteria { get; set; }

    [ForeignKey("AppStatusId")]
    [InverseProperty("SchAppointments")]
    public virtual SchAppointmentStatus AppStatus { get; set; } = null!;

    [InverseProperty("Appointment")]
    public virtual ICollection<BleligibilityLog> BleligibilityLogs { get; set; } = new List<BleligibilityLog>();

    [InverseProperty("Appointment")]
    public virtual ICollection<BlpatientVisit> BlpatientVisits { get; set; } = new List<BlpatientVisit>();

    [InverseProperty("Appointment")]
    public virtual ICollection<BlsuperBillDiagnosis> BlsuperBillDiagnoses { get; set; } = new List<BlsuperBillDiagnosis>();

    [InverseProperty("Appointent")]
    public virtual ICollection<BlsuperBillProcedureInvoice> BlsuperBillProcedureInvoices { get; set; } = new List<BlsuperBillProcedureInvoice>();

    [InverseProperty("Appointment")]
    public virtual ICollection<BlsuperBillProcedure> BlsuperBillProcedures { get; set; } = new List<BlsuperBillProcedure>();

    [InverseProperty("Visit")]
    public virtual ICollection<EligibilityLog> EligibilityLogs { get; set; } = new List<EligibilityLog>();

    [ForeignKey("EmployeeId")]
    [InverseProperty("SchAppointments")]
    public virtual Hremployee? Employee { get; set; }

    [ForeignKey("FacilityId")]
    [InverseProperty("SchAppointments")]
    public virtual RegFacility? Facility { get; set; }

    [InverseProperty("Appointment")]
    public virtual ICollection<InsuranceEligibility> InsuranceEligibilities { get; set; } = new List<InsuranceEligibility>();

    [ForeignKey("PatientId")]
    [InverseProperty("SchAppointments")]
    public virtual RegPatient? Patient { get; set; }

    [InverseProperty("Appointment")]
    public virtual ICollection<PatientAllergy> PatientAllergies { get; set; } = new List<PatientAllergy>();

    [InverseProperty("Appointment")]
    public virtual ICollection<PatientBillInvoice> PatientBillInvoices { get; set; } = new List<PatientBillInvoice>();

    [InverseProperty("Appointment")]
    public virtual ICollection<PatientImmunization> PatientImmunizations { get; set; } = new List<PatientImmunization>();

    [ForeignKey("PatientNotifiedId")]
    [InverseProperty("SchAppointments")]
    public virtual PatientNotifiedOption? PatientNotified { get; set; }

    [InverseProperty("Appointment")]
    public virtual ICollection<PatientProblem> PatientProblems { get; set; } = new List<PatientProblem>();

    [InverseProperty("Appointment")]
    public virtual ICollection<PatientProcedure> PatientProcedures { get; set; } = new List<PatientProcedure>();

    [ForeignKey("PatientStatusId")]
    [InverseProperty("SchAppointments")]
    public virtual SchPatientStatus PatientStatus { get; set; } = null!;

    [InverseProperty("Appointment")]
    public virtual ICollection<PatientVisitStatus> PatientVisitStatuses { get; set; } = new List<PatientVisitStatus>();

    [ForeignKey("PayerId")]
    [InverseProperty("SchAppointments")]
    public virtual Blpayer? Payer { get; set; }

    [ForeignKey("PlanId")]
    [InverseProperty("SchAppointments")]
    public virtual BlpayerPlan? Plan { get; set; }

    [InverseProperty("Appointment")]
    public virtual ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();

    [ForeignKey("PurposeOfVisitId")]
    [InverseProperty("SchAppointments")]
    public virtual ProblemList? PurposeOfVisitNavigation { get; set; }

    [ForeignKey("RescheduledId")]
    [InverseProperty("SchAppointments")]
    public virtual ReschedulingReason? Rescheduled { get; set; }

    [ForeignKey("SiteId")]
    [InverseProperty("SchAppointments")]
    public virtual RegLocationType Site { get; set; } = null!;

    [ForeignKey("SubscriberId")]
    [InverseProperty("SchAppointments")]
    public virtual InsuredSubscriber? Subscriber { get; set; }

    [ForeignKey("VisitStatusId")]
    [InverseProperty("SchAppointments")]
    public virtual VisitStatus? VisitStatus { get; set; }

    [ForeignKey("VisitTypeId")]
    [InverseProperty("SchAppointments")]
    public virtual VisitType? VisitType { get; set; }

    [InverseProperty("Appointment")]
    public virtual ICollection<VitalSign> VitalSigns { get; set; } = new List<VitalSign>();
}
