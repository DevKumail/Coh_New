using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFTreatmentEpisodeAspirationStage")]
[Index("IvfdashboardTreatmentCycleId", Name = "IX_IVFTreatmentEpisodeAspirationStage", IsUnique = true)]
public partial class IvftreatmentEpisodeAspirationStage
{
    [Key]
    public long AspirationId { get; set; }

    [Column("IVFDashboardTreatmentCycleId")]
    public int? IvfdashboardTreatmentCycleId { get; set; }

    public int? StatusId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("IvfdashboardTreatmentCycleId")]
    [InverseProperty("IvftreatmentEpisodeAspirationStage")]
    public virtual IvfdashboardTreatmentCycle? IvfdashboardTreatmentCycle { get; set; }

    [InverseProperty("Aspiration")]
    public virtual IvfepisodeAspirationFurtherDetails? IvfepisodeAspirationFurtherDetails { get; set; }

    [InverseProperty("Aspiration")]
    public virtual IvfepisodeAspirationOocyteRetrieval? IvfepisodeAspirationOocyteRetrieval { get; set; }
}
