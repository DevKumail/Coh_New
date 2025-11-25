using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BLCPTMasterRanges")]
public partial class BlcptmasterRanges
{
    [Key]
    public long RangeId { get; set; }

    public int ServiceTypeId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Description { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? RangeStartFrom { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? RangeEndAt { get; set; }

    public bool? Active { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("ServiceTypeId")]
    [InverseProperty("BlcptmasterRanges")]
    public virtual TypeOfServiceMaster ServiceType { get; set; } = null!;
}
