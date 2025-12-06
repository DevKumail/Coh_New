using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFPregnancyComplicationUntil20th")]
public partial class IvfpregnancyComplicationUntil20th
{
    [Key]
    public long ComplicationUntil20thId { get; set; }

    public long PregnancyId { get; set; }

    public long? ComplicationUntil20thWeekCategoryId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("PregnancyId")]
    [InverseProperty("IvfpregnancyComplicationUntil20th")]
    public virtual IvfepisodePregnancy Pregnancy { get; set; } = null!;
}
