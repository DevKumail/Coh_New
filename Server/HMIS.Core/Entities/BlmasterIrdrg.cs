using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BLMasterIRDRG")]
public partial class BlmasterIrdrg
{
    [StringLength(3)]
    [Unicode(false)]
    public string? Type { get; set; }

    [Key]
    [Column("IRDRGCode")]
    [StringLength(11)]
    public string Irdrgcode { get; set; } = null!;

    [Unicode(false)]
    public string? Description { get; set; }

    [StringLength(2)]
    [Unicode(false)]
    public string? MainCategory { get; set; }

    [Column("ALOS", TypeName = "decimal(18, 4)")]
    public decimal? Alos { get; set; }

    [Column("ltrim")]
    public int? Ltrim { get; set; }

    [Column("htrim")]
    public int? Htrim { get; set; }

    [Column("DRGweight", TypeName = "decimal(18, 4)")]
    public decimal? Drgweight { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Price { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }
}
