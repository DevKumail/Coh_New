using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFEpisodePregnancyEmbryo")]
public partial class IvfepisodePregnancyEmbryo
{
    [Key]
    public long EmbryoId { get; set; }

    public long PregnancyId { get; set; }

    [Column("PGProgressUntil24thWeekCategoryId")]
    public long? PgprogressUntil24thWeekCategoryId { get; set; }

    public string? Note { get; set; }

    public long? ImageId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("PregnancyId")]
    [InverseProperty("IvfepisodePregnancyEmbryo")]
    public virtual IvfepisodePregnancy Pregnancy { get; set; } = null!;
}
