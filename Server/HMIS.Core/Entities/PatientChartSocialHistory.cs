using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class PatientChartSocialHistory
{
    [Key]
    [Column("SHID")]
    public long Shid { get; set; }

    public long? ChartId { get; set; }

    [Column("SHItem")]
    [StringLength(100)]
    public string Shitem { get; set; } = null!;

    [Column("MRNo")]
    [StringLength(50)]
    [Unicode(false)]
    public string? Mrno { get; set; }

    public long? VisitAccountNo { get; set; }

    public long? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    public bool? Active { get; set; }

    public int? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? StartDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? EndDate { get; set; }

    public long? AppId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
