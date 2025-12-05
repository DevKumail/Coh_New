using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFEpisodePregnancy")]
[Index("PregnancyId", Name = "IX_IVFEpisodePregnancy", IsUnique = true)]
public partial class IvfepisodePregnancy
{
    [Key]
    public long Id { get; set; }

    public long PregnancyId { get; set; }

    public long? CycleOutcomeCategoryId { get; set; }

    [Column("PositivePGTestCategoryId")]
    public long? PositivePgtestCategoryId { get; set; }

    [Column("LastbhCGDate")]
    public DateTime? LastbhCgdate { get; set; }

    public DateTime? PregnancyDeterminedOnDate { get; set; }

    public long? IntrauterineCategoryId { get; set; }

    public long? ExtrauterineCategoryId { get; set; }

    public string? Notes { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [InverseProperty("Pregnancy")]
    public virtual ICollection<IvfepisodePregnancyEmbryo> IvfepisodePregnancyEmbryo { get; set; } = new List<IvfepisodePregnancyEmbryo>();

    [ForeignKey("PregnancyId")]
    [InverseProperty("IvfepisodePregnancy")]
    public virtual IvftreatmentEpisodePregnancyStage Pregnancy { get; set; } = null!;
}
