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

    [Column("HMISFileId")]
    public long HmisfileId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("HmisfileId")]
    [InverseProperty("IvftreamentsEpisodeAttachments")]
    public virtual HmisFiles Hmisfile { get; set; } = null!;

    [ForeignKey("IvfdashboardTreatmentEpisodeId")]
    [InverseProperty("IvftreamentsEpisodeAttachments")]
    public virtual IvfdashboardTreatmentCycle IvfdashboardTreatmentEpisode { get; set; } = null!;
}
