using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class PatientProcedure
{
    [Key]
    public long Id { get; set; }

    public long? ProviderId { get; set; }

    [Column("CPTCode")]
    [StringLength(11)]
    public string Cptcode { get; set; } = null!;

    [StringLength(2000)]
    public string? ProcedureDescription { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ProcedureDateTime { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Comments { get; set; }

    public int Active { get; set; }

    public long? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    [Column("MRNo")]
    [StringLength(10)]
    [Unicode(false)]
    public string? Mrno { get; set; }

    public long? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    public long? ProcedureType { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? ProcedurePriority { get; set; }

    [StringLength(11)]
    [Unicode(false)]
    public string? AssociatedDiagnosisCode { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ProcedureEndDateTime { get; set; }

    [Column("PrimaryAnestheticID")]
    [StringLength(50)]
    [Unicode(false)]
    public string? PrimaryAnestheticId { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? TypeOfAnesthesia { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? AnesthesiaStartDateTime { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? AnesthesiaEndDateTime { get; set; }

    public bool PerformedOnFacility { get; set; }

    [Column("IsHL7MsgCreated")]
    public bool? IsHl7msgCreated { get; set; }

    public bool? IsLabTest { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? ErrorReason { get; set; }

    [Column("oldMRNo")]
    [StringLength(20)]
    [Unicode(false)]
    public string? OldMrno { get; set; }

    public bool? IsDeleted { get; set; }

    public long? AppointmentId { get; set; }

    [ForeignKey("AppointmentId")]
    [InverseProperty("PatientProcedure")]
    public virtual SchAppointment? Appointment { get; set; }

    [ForeignKey("CreatedBy")]
    [InverseProperty("PatientProcedureCreatedByNavigation")]
    public virtual Hremployee? CreatedByNavigation { get; set; }

    [ForeignKey("ProcedureType")]
    [InverseProperty("PatientProcedure")]
    public virtual PatientProcedureType? ProcedureTypeNavigation { get; set; }

    [ForeignKey("UpdatedBy")]
    [InverseProperty("PatientProcedureUpdatedByNavigation")]
    public virtual Hremployee? UpdatedByNavigation { get; set; }
}
