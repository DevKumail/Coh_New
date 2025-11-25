using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[PrimaryKey("Mrno", "RelationCode", "SubscriberId", "CoverageOrder")]
public partial class InsuredCoverage
{
    [Key]
    [Column("MRNo")]
    [StringLength(10)]
    [Unicode(false)]
    public string Mrno { get; set; } = null!;

    [Key]
    [StringLength(2)]
    [Unicode(false)]
    public string RelationCode { get; set; } = null!;

    [Key]
    public long SubscriberId { get; set; }

    [Key]
    public byte CoverageOrder { get; set; }

    public bool? IsSelected { get; set; }

    [Column("oldMRNo")]
    [StringLength(20)]
    [Unicode(false)]
    public string? OldMrno { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }
}
