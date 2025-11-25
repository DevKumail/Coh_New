using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[PrimaryKey("ProcedureId", "InvoiceNo")]
[Table("BLSuperBillProcedureInvoice")]
public partial class BlsuperBillProcedureInvoice
{
    [Key]
    public long ProcedureId { get; set; }

    [Key]
    [StringLength(20)]
    [Unicode(false)]
    public string InvoiceNo { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime? DateOfServiceFrom { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DateOfServiceTo { get; set; }

    [StringLength(2)]
    [Unicode(false)]
    public string? PlaceOfService { get; set; }

    [StringLength(2)]
    [Unicode(false)]
    public string? TypeOfService { get; set; }

    [StringLength(6)]
    [Unicode(false)]
    public string ProcedureType { get; set; } = null!;

    [StringLength(50)]
    public string? ProcedureCode { get; set; }

    [StringLength(2)]
    [Unicode(false)]
    public string? Modifier1 { get; set; }

    [StringLength(2)]
    [Unicode(false)]
    public string? Modifier2 { get; set; }

    [StringLength(2)]
    [Unicode(false)]
    public string? Modifier3 { get; set; }

    [StringLength(2)]
    [Unicode(false)]
    public string? Modifier4 { get; set; }

    [StringLength(8)]
    [Unicode(false)]
    public string? DiagnosisCode { get; set; }

    [Column(TypeName = "money")]
    public decimal? UnitPrice { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Units { get; set; }

    [Column(TypeName = "money")]
    public decimal? Charges { get; set; }

    [Column("EPSDTFamilyPlan")]
    [StringLength(1)]
    [Unicode(false)]
    public string? EpsdtfamilyPlan { get; set; }

    [Column("EMG")]
    [StringLength(1)]
    [Unicode(false)]
    public string? Emg { get; set; }

    [Column("COB")]
    [StringLength(1)]
    [Unicode(false)]
    public string? Cob { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string? ReservedForLocalUse { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime LastUpdatedDate { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string LastUpdatedBy { get; set; } = null!;

    [StringLength(1)]
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
    [StringLength(10)]
    [Unicode(false)]
    public string? Hl7procedureType { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? ProcedurePriority { get; set; }

    [StringLength(11)]
    [Unicode(false)]
    public string? AssociatedDiagnosisCode { get; set; }

    [Column("PrimaryAnestheticID")]
    public long? PrimaryAnestheticId { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? TypeOfAnesthesia { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string? AnesthesiaStartDateTime { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string? AnesthesiaEndDateTime { get; set; }

    [Column("IsHL7MsgCreated")]
    public bool? IsHl7msgCreated { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? InvoiceDate { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string? InvoiceType { get; set; }

    public bool? InvoicePosted { get; set; }

    public bool? InvoiceStatus { get; set; }

    [StringLength(12)]
    [Unicode(false)]
    public string? InvoiceMode { get; set; }

    [StringLength(12)]
    [Unicode(false)]
    public string? InvoicePaymentType { get; set; }

    [Column("MRNO")]
    [StringLength(20)]
    [Unicode(false)]
    public string? Mrno { get; set; }

    [Column("payerId")]
    public long? PayerId { get; set; }

    /// <summary>
    /// Contains provider code
    /// </summary>
    [StringLength(2000)]
    public string? Description { get; set; }

    [Column("ItemID")]
    public Guid? ItemId { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? ProviderName { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? SiteName { get; set; }

    public long? SubscriberId { get; set; }

    public bool? InvoiceStatusPosted { get; set; }

    [Column("oldMRNo")]
    [StringLength(20)]
    [Unicode(false)]
    public string? OldMrno { get; set; }

    public long? OrderSetDetailId { get; set; }

    public Guid? DrugAdminId { get; set; }

    public bool IsOraclePosted { get; set; }

    [StringLength(225)]
    [Unicode(false)]
    public string? Reason { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? InactiveDate { get; set; }

    public bool? Covered { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ProviderDiscount { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? LotNo { get; set; }

    public long? DrugId { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? PatientShare { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? PatientShareCategory { get; set; }

    [Column("ChargeswithVAT", TypeName = "decimal(18, 2)")]
    public decimal? ChargeswithVat { get; set; }

    [Column("VATPercentage", TypeName = "decimal(18, 2)")]
    public decimal? Vatpercentage { get; set; }

    [Column("VATAmount", TypeName = "decimal(18, 2)")]
    public decimal? Vatamount { get; set; }

    [Column("PatientshareVAT", TypeName = "decimal(18, 2)")]
    public decimal? PatientshareVat { get; set; }

    [Column("ChargeswithoutVAT", TypeName = "decimal(18, 2)")]
    public decimal? ChargeswithoutVat { get; set; }

    [Column("IsIVFBundle")]
    [StringLength(1)]
    [Unicode(false)]
    public string? IsIvfbundle { get; set; }

    public bool? IsDeleted { get; set; }

    public long? AppointentId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("AppointentId")]
    [InverseProperty("BlsuperBillProcedureInvoice")]
    public virtual SchAppointment? Appointent { get; set; }
}
