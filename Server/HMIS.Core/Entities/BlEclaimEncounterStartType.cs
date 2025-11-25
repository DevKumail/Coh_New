using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BL_EClaimEncounterStartType")]
public partial class BlEclaimEncounterStartType
{
    [Key]
    public long Id { get; set; }

    public int Code { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string Text { get; set; } = null!;

    [Column("isActive")]
    public bool IsActive { get; set; }

    [Column("isDeleted")]
    public bool IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }
}
