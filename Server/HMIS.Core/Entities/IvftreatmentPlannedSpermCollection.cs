using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFTreatmentPlannedSpermCollection")]
public partial class IvftreatmentPlannedSpermCollection
{
    [Key]
    public int PlannedSpermCollectionId { get; set; }

    [Column("IVFDashboardTreatmentCycleId")]
    public int? IvfdashboardTreatmentCycleId { get; set; }

    public long? PlannedSpermCollectionCategoryId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("IvfdashboardTreatmentCycleId")]
    [InverseProperty("IvftreatmentPlannedSpermCollection")]
    public virtual IvfdashboardTreatmentCycle? IvfdashboardTreatmentCycle { get; set; }

    [ForeignKey("PlannedSpermCollectionCategoryId")]
    [InverseProperty("IvftreatmentPlannedSpermCollection")]
    public virtual DropdownConfiguration? PlannedSpermCollectionCategory { get; set; }
}
