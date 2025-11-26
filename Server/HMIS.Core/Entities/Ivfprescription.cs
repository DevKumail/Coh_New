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
    public long? MedicationId { get; set; }

    public long? OverviewId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("MedicationId")]
    public virtual Medications? Medication { get; set; }

    [ForeignKey("OverviewId")]
    public virtual IvftreatmentEpisodeOverviewStage? Overview { get; set; }
}
