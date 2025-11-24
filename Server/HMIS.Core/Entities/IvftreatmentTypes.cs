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

    [ForeignKey("IvfdashboardTreatmentEpisodeId")]
    [InverseProperty("IvftreatmentTypes")]
    public virtual IvfdashboardTreatmentEpisode? IvfdashboardTreatmentEpisode { get; set; }

    [ForeignKey("TreatmentCategoryId")]
    [InverseProperty("IvftreatmentTypes")]
    public virtual DropdownConfiguration? TreatmentCategory { get; set; }
}
