using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFOverviewOHSS")]
public partial class IvfoverviewOhss
{
    [Key]
    [Column("OHSSId")]
    public int Ohssid { get; set; }

    public long? OverviewId { get; set; }

    [Column("OHSSDiagnosisCategoryId")]
    public long? OhssdiagnosisCategoryId { get; set; }

    public long? AdverseSideEffectsCategoryId { get; set; }

    [StringLength(100)]
    public string? AdverseSideEffects { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("AdverseSideEffectsCategoryId")]
    [InverseProperty("IvfoverviewOhssAdverseSideEffectsCategory")]
    public virtual DropdownConfiguration? AdverseSideEffectsCategory { get; set; }

    [ForeignKey("OhssdiagnosisCategoryId")]
    [InverseProperty("IvfoverviewOhssOhssdiagnosisCategory")]
    public virtual DropdownConfiguration? OhssdiagnosisCategory { get; set; }

    [ForeignKey("OverviewId")]
    [InverseProperty("IvfoverviewOhss")]
    public virtual IvftreatmentEpisodeOverviewStage? Overview { get; set; }
}
