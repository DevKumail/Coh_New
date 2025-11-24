using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFTreamentsEpisodeAttachments")]
public partial class IvftreamentsEpisodeAttachments
{
    [Key]
    public int Id { get; set; }

    [Column("IVFDashboardTreatmentEpisodeId")]
    public int IvfdashboardTreatmentEpisodeId { get; set; }

    [ForeignKey("IvfdashboardTreatmentEpisodeId")]
    [InverseProperty("IvftreamentsEpisodeAttachments")]
    public virtual IvfdashboardTreatmentEpisode IvfdashboardTreatmentEpisode { get; set; } = null!;
}
