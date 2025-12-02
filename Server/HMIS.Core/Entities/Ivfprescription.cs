using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
[Table("IVFPrescription")]
public partial class Ivfprescription
{
    [Column("IVFPrescriptionMasterId")]
    public long IvfprescriptionMasterId { get; set; }

    public long MedicationId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("IvfprescriptionMasterId")]
    public virtual IvfprescriptionMaster IvfprescriptionMaster { get; set; } = null!;

    [ForeignKey("MedicationId")]
    public virtual Medications Medication { get; set; } = null!;
}
