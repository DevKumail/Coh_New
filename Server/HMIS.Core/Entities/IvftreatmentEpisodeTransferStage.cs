using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFTreatmentEpisodeTransferStage")]
[Index("IvfdashboardTreatmentCycleId", Name = "IX_IVFTreatmentEpisodeTransferStage", IsUnique = true)]
public partial class IvftreatmentEpisodeTransferStage
{
    [Key]
    public long TransferId { get; set; }

    [Column("IVFDashboardTreatmentCycleId")]
    public int IvfdashboardTreatmentCycleId { get; set; }

    public int? StatusId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("IvfdashboardTreatmentCycleId")]
    [InverseProperty("IvftreatmentEpisodeTransferStage")]
    public virtual IvfdashboardTreatmentCycle IvfdashboardTreatmentCycle { get; set; } = null!;

    [InverseProperty("Transfer")]
    public virtual IvfepisodeTransfer? IvfepisodeTransfer { get; set; }

    [InverseProperty("Transfer")]
    public virtual ICollection<IvfepisodeTransferEmbryoInTransfer> IvfepisodeTransferEmbryoInTransfer { get; set; } = new List<IvfepisodeTransferEmbryoInTransfer>();
}
