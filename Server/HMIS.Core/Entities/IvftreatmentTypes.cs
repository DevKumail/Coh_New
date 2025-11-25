using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFTreatmentTypes")]
public partial class IvftreatmentTypes
{
    [Key]
    [Column("IVFTreatmentTypeId")]
    public int IvftreatmentTypeId { get; set; }

    [Column("IVFDashboardTreatmentEpisodeId")]
    public int? IvfdashboardTreatmentEpisodeId { get; set; }

    public long? TreatmentCategoryId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("IvfdashboardTreatmentEpisodeId")]
    [InverseProperty("IvftreatmentTypes")]
    public virtual IvfdashboardTreatmentCycle? IvfdashboardTreatmentEpisode { get; set; }

    [ForeignKey("TreatmentCategoryId")]
    [InverseProperty("IvftreatmentTypes")]
    public virtual DropdownConfiguration? TreatmentCategory { get; set; }
}
