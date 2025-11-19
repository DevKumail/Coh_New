using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleFHImpairmentFactor")]
public partial class IvfmaleFhimpairmentFactor
{
    [Key]
    [Column("IVFMaleFHImpairmentFactorId")]
    public int IvfmaleFhimpairmentFactorId { get; set; }

    [Column("IVFMaleFHId")]
    public int IvfmaleFhid { get; set; }

    [StringLength(11)]
    public string ImpairmentFactor { get; set; } = null!;

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("ImpairmentFactor")]
    [InverseProperty("IvfmaleFhimpairmentFactor")]
    public virtual BlmasterIcd9cm ImpairmentFactorNavigation { get; set; } = null!;

    [ForeignKey("IvfmaleFhid")]
    [InverseProperty("IvfmaleFhimpairmentFactor")]
    public virtual IvfmaleFertilityHistory IvfmaleFh { get; set; } = null!;
}
