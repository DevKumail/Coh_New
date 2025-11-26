using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BLMasterWeqaya")]
public partial class BlmasterWeqaya
{
    [Key]
    public long WeqayaId { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string? Type { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Code { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? Value { get; set; }

    [StringLength(2000)]
    [Unicode(false)]
    public string? ValueType { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? ObservationGroup { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? ValueRange { get; set; }

    public bool? ValueTypeNumeric { get; set; }

    public bool? IsWeqaya { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string? ValidationType { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? ParentWeqayaId { get; set; }

    [Column("ExclusionUAEServiceGroup")]
    public short? ExclusionUaeserviceGroup { get; set; }

    [Column("InclusionUAEServiceGroup")]
    public short? InclusionUaeserviceGroup { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }
}
