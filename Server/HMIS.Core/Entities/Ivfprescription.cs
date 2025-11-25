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
    public long? PrescriptionId { get; set; }

    public long? OverviewId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("OverviewId")]
    public virtual IvftreatmentEpisodeOverviewStage? Overview { get; set; }

    [ForeignKey("PrescriptionId")]
    public virtual Prescription? Prescription { get; set; }
}
