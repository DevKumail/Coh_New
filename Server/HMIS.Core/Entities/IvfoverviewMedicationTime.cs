using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFOverviewMedicationTime")]
public partial class IvfoverviewMedicationTime
{
    [Key]
    [Column("IVFOverviewMedicationTimeId")]
    public long IvfoverviewMedicationTimeId { get; set; }

    public long MedicationId { get; set; }

    [Precision(3)]
    public TimeOnly? Time { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("MedicationId")]
    [InverseProperty("IvfoverviewMedicationTime")]
    public virtual Medications Medication { get; set; } = null!;
}
