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

    [StringLength(150)]
    public string? ImpairmentFactor { get; set; }

    [ForeignKey("IvfmaleFhid")]
    [InverseProperty("IvfmaleFhimpairmentFactor")]
    public virtual IvfmaleFertilityHistory IvfmaleFh { get; set; } = null!;
}
