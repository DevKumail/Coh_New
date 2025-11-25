using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[PrimaryKey("GroupCodeId", "GroupId", "Cptcode")]
[Table("BLCPTGroupCode")]
public partial class BlcptgroupCode
{
    [Key]
    [Column("GroupCodeID")]
    public long GroupCodeId { get; set; }

    [Key]
    public long GroupId { get; set; }

    [Key]
    [Column("CPTCode")]
    [StringLength(11)]
    public string Cptcode { get; set; } = null!;

    [StringLength(2000)]
    public string DescriptionUser { get; set; } = null!;

    [Column(TypeName = "money")]
    public decimal? UnitPrice { get; set; }

    public long PayerId { get; set; }

    [StringLength(2000)]
    public string? ProviderDescription { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("GroupId")]
    [InverseProperty("BlcptgroupCode")]
    public virtual Blcptgroup Group { get; set; } = null!;
}
