using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFPregnancyComplicationAfter20th")]
public partial class IvfpregnancyComplicationAfter20th
{
    [Key]
    public long ComplicationAfter20thId { get; set; }

    public long PregnancyId { get; set; }

    public long? ComplicationAfter20thWeekCategoryId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("PregnancyId")]
    [InverseProperty("IvfpregnancyComplicationAfter20th")]
    public virtual IvftreatmentEpisodePregnancyStage Pregnancy { get; set; } = null!;
}
