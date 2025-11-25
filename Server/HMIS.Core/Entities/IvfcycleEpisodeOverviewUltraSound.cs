using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
[Table("IVFCycleEpisodeOverviewUltraSound")]
public partial class IvfcycleEpisodeOverviewUltraSound
{
    public long OverviewId { get; set; }

    public long AppId { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [ForeignKey("AppId")]
    public virtual SchAppointment App { get; set; } = null!;

    [ForeignKey("OverviewId")]
    public virtual IvftreatmentEpisodeOverviewStage Overview { get; set; } = null!;
}
