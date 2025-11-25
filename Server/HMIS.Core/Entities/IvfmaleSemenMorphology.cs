using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleSemenMorphology")]
public partial class IvfmaleSemenMorphology
{
    [Key]
    public int MorphologyId { get; set; }

    public int ObservationId { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? MorphologyNormalPercent { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? HeadDefectsPercent { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? NeckMidpieceDefectsPercent { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? TailDefectsPercent { get; set; }

    [Column("ERCPercent", TypeName = "decimal(5, 2)")]
    public decimal? Ercpercent { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? MultipleDefectsPercent { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? TeratozoospermiaIndex { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedAt { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }
}
