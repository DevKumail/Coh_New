using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFEpisodeTransferEmbryoInTransfer")]
public partial class IvfepisodeTransferEmbryoInTransfer
{
    [Key]
    public long EmbryoInTransferId { get; set; }

    public long TransferId { get; set; }

    public long? SequenceId { get; set; }

    public long? EmbryoId { get; set; }

    [StringLength(50)]
    public string? CellInformation { get; set; }

    public bool? Ideal { get; set; }

    public long? ScoreCategoryId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("ScoreCategoryId")]
    [InverseProperty("IvfepisodeTransferEmbryoInTransfer")]
    public virtual DropdownConfiguration? ScoreCategory { get; set; }

    [ForeignKey("TransferId")]
    [InverseProperty("IvfepisodeTransferEmbryoInTransfer")]
    public virtual IvftreatmentEpisodeTransferStage Transfer { get; set; } = null!;
}
