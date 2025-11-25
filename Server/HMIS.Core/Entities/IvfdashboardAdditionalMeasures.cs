using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFDashboardAdditionalMeasures")]
public partial class IvfdashboardAdditionalMeasures
{
    [Key]
    [Column("IVFAdditionalMeasuresId")]
    public int IvfadditionalMeasuresId { get; set; }

    [Column("IVFDashboardTreatmentEpisodeId")]
    public int IvfdashboardTreatmentEpisodeId { get; set; }

    [StringLength(50)]
    public string? GeneralCondition { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("IvfdashboardTreatmentEpisodeId")]
    [InverseProperty("IvfdashboardAdditionalMeasures")]
    public virtual IvfdashboardTreatmentEpisode IvfdashboardTreatmentEpisode { get; set; } = null!;

    [InverseProperty("IvfadditionalMeasures")]
    public virtual ICollection<IvfembblastIndications> IvfembblastIndications { get; set; } = new List<IvfembblastIndications>();

    [InverseProperty("IvfadditionalMeasures")]
    public virtual ICollection<IvfperformedAdditionalMeasures> IvfperformedAdditionalMeasures { get; set; } = new List<IvfperformedAdditionalMeasures>();

    [InverseProperty("IvfadditionalMeasures")]
    public virtual ICollection<IvfplannedAdditionalMeasures> IvfplannedAdditionalMeasures { get; set; } = new List<IvfplannedAdditionalMeasures>();

    [InverseProperty("IvfadditionalMeasures")]
    public virtual ICollection<IvfpolarBodiesIndications> IvfpolarBodiesIndications { get; set; } = new List<IvfpolarBodiesIndications>();
}
