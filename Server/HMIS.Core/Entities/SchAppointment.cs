using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Index("AppDateTime", Name = "IX_SchAppointment_AppDateTime")]
[Index("AppStatusId", Name = "IX_SchAppointment_AppStatusId")]
[Index("IsDeleted", "AppDateTime", "ProviderId", "FacilityId", "SiteId", "SpecialtyId", "LocationId", "AppStatusId", "AppCriteriaId", "VisitTypeId", Name = "IX_SchAppointment_Filters")]
[Index("Mrno", Name = "IX_SchAppointment_MRNo")]
[Index("Mrno", "AppDateTime", Name = "IX_SchAppointment_MRNo_Date")]
[Index("ProviderId", Name = "IX_SchAppointment_ProviderId")]
[Index("ProviderId", "AppDateTime", Name = "IX_SchAppointment_Provider_Date")]
[Index("SiteId", Name = "IX_SchAppointment_SiteId")]
[Index("AppStatusId", "AppDateTime", Name = "IX_SchAppointment_Status_Date")]
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

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [ForeignKey("AppCriteriaId")]
    [InverseProperty("SchAppointment")]
    public virtual SchAppointmentCriteria? AppCriteria { get; set; }

    [ForeignKey("AppStatusId")]
    [InverseProperty("SchAppointment")]
    public virtual SchAppointmentStatus AppStatus { get; set; } = null!;

    [InverseProperty("Appointment")]
    public virtual ICollection<BleligibilityLog> BleligibilityLog { get; set; } = new List<BleligibilityLog>();

    [InverseProperty("Appointment")]
    public virtual ICollection<BlpatientVisit> BlpatientVisit { get; set; } = new List<BlpatientVisit>();

    [InverseProperty("Appointment")]
    public virtual ICollection<BlsuperBillDiagnosis> BlsuperBillDiagnosis { get; set; } = new List<BlsuperBillDiagnosis>();

    [InverseProperty("Appointment")]
    public virtual ICollection<BlsuperBillProcedure> BlsuperBillProcedure { get; set; } = new List<BlsuperBillProcedure>();

    [InverseProperty("Appointent")]
    public virtual ICollection<BlsuperBillProcedureInvoice> BlsuperBillProcedureInvoice { get; set; } = new List<BlsuperBillProcedureInvoice>();

    [InverseProperty("Visit")]
    public virtual ICollection<EligibilityLog> EligibilityLog { get; set; } = new List<EligibilityLog>();

    [ForeignKey("EmployeeId")]
    [InverseProperty("SchAppointment")]
    public virtual Hremployee? Employee { get; set; }

    [ForeignKey("FacilityId")]
    [InverseProperty("SchAppointment")]
    public virtual RegFacility? Facility { get; set; }

    [InverseProperty("Appointment")]
    public virtual ICollection<InsuranceEligibility> InsuranceEligibility { get; set; } = new List<InsuranceEligibility>();

    [InverseProperty("App")]
    public virtual ICollection<Ivfmain> Ivfmain { get; set; } = new List<Ivfmain>();

    [InverseProperty("App")]
    public virtual ICollection<LabOrderSet> LabOrderSet { get; set; } = new List<LabOrderSet>();

    [InverseProperty("Appointment")]
    public virtual ICollection<Medications> Medications { get; set; } = new List<Medications>();

    [ForeignKey("PatientId")]
    [InverseProperty("SchAppointment")]
    public virtual RegPatient? Patient { get; set; }

    [InverseProperty("Appointment")]
    public virtual ICollection<PatientAllergy> PatientAllergy { get; set; } = new List<PatientAllergy>();

    [InverseProperty("Appointment")]
    public virtual ICollection<PatientBillInvoice> PatientBillInvoice { get; set; } = new List<PatientBillInvoice>();

    [InverseProperty("Appointment")]
    public virtual ICollection<PatientImmunization> PatientImmunization { get; set; } = new List<PatientImmunization>();

    [ForeignKey("PatientNotifiedId")]
    [InverseProperty("SchAppointment")]
    public virtual PatientNotifiedOptions? PatientNotified { get; set; }

    [InverseProperty("Appointment")]
    public virtual ICollection<PatientProblem> PatientProblem { get; set; } = new List<PatientProblem>();

    [InverseProperty("Appointment")]
    public virtual ICollection<PatientProcedure> PatientProcedure { get; set; } = new List<PatientProcedure>();

    [ForeignKey("PatientStatusId")]
    [InverseProperty("SchAppointment")]
    public virtual SchPatientStatus PatientStatus { get; set; } = null!;

    [InverseProperty("Appointment")]
    public virtual ICollection<PatientVisitStatus> PatientVisitStatus { get; set; } = new List<PatientVisitStatus>();

    [ForeignKey("PayerId")]
    [InverseProperty("SchAppointment")]
    public virtual Blpayer? Payer { get; set; }

    [ForeignKey("PlanId")]
    [InverseProperty("SchAppointment")]
    public virtual BlpayerPlan? Plan { get; set; }

    [ForeignKey("PurposeOfVisitId")]
    [InverseProperty("SchAppointment")]
    public virtual ProblemList? PurposeOfVisitNavigation { get; set; }

    [ForeignKey("RescheduledId")]
    [InverseProperty("SchAppointment")]
    public virtual ReschedulingReasons? Rescheduled { get; set; }

    [ForeignKey("SiteId")]
    [InverseProperty("SchAppointment")]
    public virtual RegLocationTypes Site { get; set; } = null!;

    [InverseProperty("Appointment")]
    public virtual ICollection<SpeechToText> SpeechToText { get; set; } = new List<SpeechToText>();

    [ForeignKey("SubscriberId")]
    [InverseProperty("SchAppointment")]
    public virtual InsuredSubscriber? Subscriber { get; set; }

    [ForeignKey("VisitStatusId")]
    [InverseProperty("SchAppointment")]
    public virtual VisitStatus? VisitStatus { get; set; }

    [ForeignKey("VisitTypeId")]
    [InverseProperty("SchAppointment")]
    public virtual VisitType? VisitType { get; set; }

    [InverseProperty("Appointment")]
    public virtual ICollection<VitalSigns> VitalSigns { get; set; } = new List<VitalSigns>();
}
