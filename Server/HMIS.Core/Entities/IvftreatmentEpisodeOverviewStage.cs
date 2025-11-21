using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFTreatmentEpisodeOverviewStage")]
public partial class IvftreatmentEpisodeOverviewStage
{
    [Key]
    public long OverviewId { get; set; }

    [Column("IVFFemaleTreatmentEpisodeId")]
    public int? IvffemaleTreatmentEpisodeId { get; set; }

    [ForeignKey("IvffemaleTreatmentEpisodeId")]
    [InverseProperty("IvftreatmentEpisodeOverviewStage")]
    public virtual IvfdashboardTreatmentEpisode? IvffemaleTreatmentEpisode { get; set; }
}
