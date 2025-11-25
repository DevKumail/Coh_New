using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BLSuperBillProcedure")]
public partial class BlsuperBillProcedure
{
    [Key]
    public long ProcedureId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DateOfServiceFrom { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DateOfServiceTo { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? PlaceOfService { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? TypeOfService { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string ProcedureType { get; set; } = null!;

    [StringLength(50)]
    public string? ProcedureCode { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Modifier1 { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Modifier2 { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Modifier3 { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Modifier4 { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? DiagnosisCode { get; set; }

    [Column(TypeName = "money")]
    public decimal? UnitPrice { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Units { get; set; }

    [Column(TypeName = "money")]
    public decimal? Charges { get; set; }

    [Column("EPSDTFamilyPlan")]
    [StringLength(50)]
    [Unicode(false)]
    public string? EpsdtfamilyPlan { get; set; }

    [Column("EMG")]
    [StringLength(50)]
    [Unicode(false)]
    public string? Emg { get; set; }

    [Column("COB")]
    [StringLength(50)]
    [Unicode(false)]
    public string? Cob { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string? ReservedForLocalUse { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? LastUpdatedDate { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? LastUpdatedBy { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? PerformedOnFacility { get; set; }

    public bool? IsLabTest { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Discount { get; set; }

    public bool? Confidential { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    [Column("HL7ProcedureType")]
    [StringLength(50)]
    [Unicode(false)]
    public string? Hl7procedureType { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? ProcedurePriority { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? AssociatedDiagnosisCode { get; set; }

    [Column("PrimaryAnestheticID")]
    public long? PrimaryAnestheticId { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? TypeOfAnesthesia { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? AnesthesiaStartDateTime { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? AnesthesiaEndDateTime { get; set; }

    [Column("IsHL7MsgCreated")]
    public bool? IsHl7msgCreated { get; set; }

    [Column("ItemID")]
    public Guid? ItemId { get; set; }

    [StringLength(2000)]
    public string? Description { get; set; }

    public long? OrderSetDetailId { get; set; }

    public Guid? DrugAdminId { get; set; }

    public bool? Covered { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ProviderDiscount { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? LotNo { get; set; }

    public long? DrugId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? ToothCode { get; set; }

    public bool? ToothCodeRequired { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Patientshare { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? PatientShareCategory { get; set; }

    [Column("ChargesWithVAT", TypeName = "decimal(18, 2)")]
    public decimal? ChargesWithVat { get; set; }

    [Column("VATPercentage", TypeName = "decimal(18, 2)")]
    public decimal? Vatpercentage { get; set; }

    [Column("VATAmount", TypeName = "decimal(18, 2)")]
    public decimal? Vatamount { get; set; }

    [Column("PatientshareVAT", TypeName = "decimal(18, 2)")]
    public decimal? PatientshareVat { get; set; }

    [Column("ChargeswithoutVAT", TypeName = "decimal(18, 2)")]
    public decimal? ChargeswithoutVat { get; set; }

    [Column("IsIVFBundle")]
    [StringLength(50)]
    [Unicode(false)]
    public string? IsIvfbundle { get; set; }

    public bool? IsDeleted { get; set; }

    public long? AppointmentId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [ForeignKey("AppointmentId")]
    [InverseProperty("BlsuperBillProcedure")]
    public virtual SchAppointment? Appointment { get; set; }

    [InverseProperty("Procedure")]
    public virtual ICollection<PatientBill> PatientBill { get; set; } = new List<PatientBill>();
}
