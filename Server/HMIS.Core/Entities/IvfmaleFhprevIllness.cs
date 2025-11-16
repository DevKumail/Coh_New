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

    [Column("ICDCode")]
    [StringLength(50)]
    public string Icdcode { get; set; } = null!;

    [ForeignKey("IvfmaleFhid")]
    [InverseProperty("IvfmaleFhprevIllness")]
    public virtual IvfmaleFertilityHistory IvfmaleFh { get; set; } = null!;
}
