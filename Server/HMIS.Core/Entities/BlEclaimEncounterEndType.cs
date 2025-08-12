using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BL_EClaimEncounterEndType")]
public partial class BlEclaimEncounterEndType
{
    [Key]
    public long Id { get; set; }

    public int Code { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string Text { get; set; } = null!;

    [Column("isTeleMedicine")]
    public bool IsTeleMedicine { get; set; }

    [Column("isActive")]
    public bool IsActive { get; set; }

    [Column("isDeleted")]
    public bool IsDeleted { get; set; }
}
