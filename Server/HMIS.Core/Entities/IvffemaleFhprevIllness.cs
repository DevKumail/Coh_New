using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFFemaleFHPrevIllness")]
public partial class IvffemaleFhprevIllness
{
    [Key]
    [Column("IVFFemaleFHPrevIllnessId")]
    public int IvffemaleFhprevIllnessId { get; set; }

    [Column("IVFFemaleFHId")]
    public int IvffemaleFhid { get; set; }

    [StringLength(11)]
    public string PrevIllness { get; set; } = null!;

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("IvffemaleFhid")]
    [InverseProperty("IvffemaleFhprevIllness")]
    public virtual IvffemaleFertilityHistory IvffemaleFh { get; set; } = null!;

    [ForeignKey("PrevIllness")]
    [InverseProperty("IvffemaleFhprevIllness")]
    public virtual BlmasterIcd9cm PrevIllnessNavigation { get; set; } = null!;
}
