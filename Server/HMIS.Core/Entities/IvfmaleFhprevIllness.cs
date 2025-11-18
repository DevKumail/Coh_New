using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleFHPrevIllness")]
public partial class IvfmaleFhprevIllness
{
    [Key]
    [Column("IVFMaleFHPrevIllnessId")]
    public int IvfmaleFhprevIllnessId { get; set; }

    [Column("IVFMaleFHId")]
    public int IvfmaleFhid { get; set; }

    public long PrevIllnessCategoryId { get; set; }

    [ForeignKey("IvfmaleFhid")]
    [InverseProperty("IvfmaleFhprevIllness")]
    public virtual IvfmaleFertilityHistory IvfmaleFh { get; set; } = null!;

    [ForeignKey("PrevIllnessCategoryId")]
    [InverseProperty("IvfmaleFhprevIllness")]
    public virtual DropdownConfiguration PrevIllnessCategory { get; set; } = null!;
}
