using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFPrescription")]
public partial class Ivfprescription
{
    [Key]
    [Column("IVFPrescriptionId")]
    public long IvfprescriptionId { get; set; }

    [Column("IVFPrescriptionMasterId")]
    public long IvfprescriptionMasterId { get; set; }

    public long AppointmentId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? StartDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? EndDate { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("AppointmentId")]
    [InverseProperty("Ivfprescription")]
    public virtual SchAppointment Appointment { get; set; } = null!;

    [ForeignKey("IvfprescriptionMasterId")]
    [InverseProperty("Ivfprescription")]
    public virtual IvfprescriptionMaster IvfprescriptionMaster { get; set; } = null!;
}
