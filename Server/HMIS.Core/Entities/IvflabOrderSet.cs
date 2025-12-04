using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFLabOrderSet")]
public partial class IvflabOrderSet
{
    [Key]
    [Column("IVFLabOrderSetId")]
    public long IvflabOrderSetId { get; set; }

    public long OverviewId { get; set; }

    public long OrderSetDetailId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("OrderSetDetailId")]
    [InverseProperty("IvflabOrderSet")]
    public virtual LabOrderSetDetail OrderSetDetail { get; set; } = null!;

    [ForeignKey("OverviewId")]
    [InverseProperty("IvflabOrderSet")]
    public virtual IvftreatmentEpisodeOverviewStage Overview { get; set; } = null!;
}
