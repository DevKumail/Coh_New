using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
[Table("IVFEpisodeOverviewLabTestOrder")]
public partial class IvfepisodeOverviewLabTestOrder
{
    public long? AppId { get; set; }

    public long? OverviewId { get; set; }

    [ForeignKey("AppId")]
    public virtual SchAppointment? App { get; set; }

    [ForeignKey("OverviewId")]
    public virtual IvftreatmentEpisodeOverviewStage? Overview { get; set; }
}
