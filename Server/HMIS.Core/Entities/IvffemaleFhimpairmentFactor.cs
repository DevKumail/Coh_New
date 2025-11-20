using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFFemaleFHImpairmentFactor")]
public partial class IvffemaleFhimpairmentFactor
{
    [Key]
    [Column("IVFFemaleFHImpairmentFactorId")]
    public int IvffemaleFhimpairmentFactorId { get; set; }

    [Column("IVFFemaleFHId")]
    public int IvffemaleFhid { get; set; }

    [StringLength(11)]
    public string ImpairmentFactor { get; set; } = null!;

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("ImpairmentFactor")]
    [InverseProperty("IvffemaleFhimpairmentFactor")]
    public virtual BlmasterIcd9cm ImpairmentFactorNavigation { get; set; } = null!;

    [ForeignKey("IvffemaleFhid")]
    [InverseProperty("IvffemaleFhimpairmentFactor")]
    public virtual IvffemaleFertilityHistory IvffemaleFh { get; set; } = null!;
}
