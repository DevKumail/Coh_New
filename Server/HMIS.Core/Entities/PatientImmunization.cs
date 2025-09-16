using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class PatientImmunization
{
    [Key]
    public long Id { get; set; }

    public long? AppointmentId { get; set; }

    public long? DrugTypeId { get; set; }

    public long? ProviderId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? StartDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? EndDate { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Comments { get; set; }

    public byte? Status { get; set; }

    public bool Active { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? ManufacturerName { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? LotNumber { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ExpiryDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? InjectionDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NextInjectionDate { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? SiteInjection { get; set; }

    public long? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime UpdatedDate { get; set; }

    [Column("MRNo")]
    [StringLength(10)]
    [Unicode(false)]
    public string? Mrno { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? DrugName { get; set; }

    public long? RouteId { get; set; }

    [Column("VISDate", TypeName = "datetime")]
    public DateTime? Visdate { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? ProviderName { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? ErrorReason { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string? Dose { get; set; }

    [Column("oldMRNo")]
    [StringLength(20)]
    [Unicode(false)]
    public string? OldMrno { get; set; }

    public bool? IsDeleted { get; set; }

    public long CreatedBy { get; set; }

    public long? ImmTypeId { get; set; }

    [ForeignKey("AppointmentId")]
    [InverseProperty("PatientImmunization")]
    public virtual SchAppointment? Appointment { get; set; }

    [ForeignKey("CreatedBy")]
    [InverseProperty("PatientImmunizationCreatedByNavigation")]
    public virtual Hremployee CreatedByNavigation { get; set; } = null!;

    [ForeignKey("DrugTypeId")]
    [InverseProperty("PatientImmunizationDrugType")]
    public virtual ImmunizationList? DrugType { get; set; }

    [ForeignKey("ImmTypeId")]
    [InverseProperty("PatientImmunizationImmType")]
    public virtual ImmunizationList? ImmType { get; set; }

    [ForeignKey("ProviderId")]
    [InverseProperty("PatientImmunizationProvider")]
    public virtual Hremployee? Provider { get; set; }

    [ForeignKey("RouteId")]
    [InverseProperty("PatientImmunization")]
    public virtual Emrroute? Route { get; set; }

    [ForeignKey("UpdatedBy")]
    [InverseProperty("PatientImmunizationUpdatedByNavigation")]
    public virtual Hremployee? UpdatedByNavigation { get; set; }
}
