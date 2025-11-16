using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleFHSemenAnalysis")]
public partial class IvfmaleFhsemenAnalysis
{
    [Key]
    [Column("IVFMaleFHSemenAnalysisId")]
    public int IvfmaleFhsemenAnalysisId { get; set; }

    [Column("IVFMaleFHId")]
    public int IvfmaleFhid { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? Concentration { get; set; }

    public int? OverallMotility { get; set; }

    [StringLength(50)]
    public string? ProgressiveMotility { get; set; }

    [StringLength(50)]
    public string? NormalForms { get; set; }

    [ForeignKey("IvfmaleFhid")]
    [InverseProperty("IvfmaleFhsemenAnalysis")]
    public virtual IvfmaleFertilityHistory IvfmaleFh { get; set; } = null!;
}
