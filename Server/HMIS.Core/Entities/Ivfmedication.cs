using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
[Table("IVFMedication")]
public partial class Ivfmedication
{
    public long? MedicationId { get; set; }

    public long? OverviewId { get; set; }

    [ForeignKey("MedicationId")]
    public virtual Medication? Medication { get; set; }

    [ForeignKey("OverviewId")]
    public virtual IvftreatmentEpisodeOverviewStage? Overview { get; set; }
}
