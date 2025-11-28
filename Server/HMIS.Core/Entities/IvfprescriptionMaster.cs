using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFPrescriptionMaster")]
public partial class IvfprescriptionMaster
{
    [Key]
    [Column("IVFPrescriptionMasterId")]
    public long IvfprescriptionMasterId { get; set; }

    public long OverviewId { get; set; }

    public long DrugId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("DrugId")]
    [InverseProperty("IvfprescriptionMaster")]
    public virtual TabDrugsName Drug { get; set; } = null!;

    [ForeignKey("OverviewId")]
    [InverseProperty("IvfprescriptionMaster")]
    public virtual IvftreatmentEpisodeOverviewStage Overview { get; set; } = null!;
}
