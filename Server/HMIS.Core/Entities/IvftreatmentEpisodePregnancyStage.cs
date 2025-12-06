using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFTreatmentEpisodePregnancyStage")]
[Index("IvfdashboardTreatmentCycleId", Name = "IX_IVFTreatmentEpisodePregnancyStage", IsUnique = true)]
public partial class IvftreatmentEpisodePregnancyStage
{
    [Key]
    public long PregnancyId { get; set; }

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
    [InverseProperty("IvftreatmentEpisodePregnancyStage")]
    public virtual IvfdashboardTreatmentCycle IvfdashboardTreatmentCycle { get; set; } = null!;

    [InverseProperty("Pregnancy")]
    public virtual IvfepisodePregnancy? IvfepisodePregnancy { get; set; }

    [InverseProperty("Pregnancy")]
    public virtual ICollection<IvfpregnancyComplicationAfter20th> IvfpregnancyComplicationAfter20th { get; set; } = new List<IvfpregnancyComplicationAfter20th>();
}
