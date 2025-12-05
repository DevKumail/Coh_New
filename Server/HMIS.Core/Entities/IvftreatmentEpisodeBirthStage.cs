using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFTreatmentEpisodeBirthStage")]
[Index("IvfdashboardTreatmentCycleId", Name = "IX_IVFTreatmentEpisodeBirthStage", IsUnique = true)]
public partial class IvftreatmentEpisodeBirthStage
{
    [Key]
    public long BirthId { get; set; }

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
    [InverseProperty("IvftreatmentEpisodeBirthStage")]
    public virtual IvfdashboardTreatmentCycle IvfdashboardTreatmentCycle { get; set; } = null!;
}
