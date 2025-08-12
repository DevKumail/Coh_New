using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BLUnclassifiedCodes")]
public partial class BlunclassifiedCode
{
    [Key]
    [Column("UnclassifiedID")]
    public long UnclassifiedId { get; set; }

    [StringLength(11)]
    public string ItemName { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string? ItemType { get; set; }

    [StringLength(2000)]
    public string? Description { get; set; }

    public Guid? AccountGuid { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? UnitPrice { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public bool? IsActive { get; set; }

    [Column("InclusionUAEServiceGroup")]
    public int? InclusionUaeserviceGroup { get; set; }

    public bool? IsDeleted { get; set; }
}
