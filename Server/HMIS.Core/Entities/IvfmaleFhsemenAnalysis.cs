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

    [Column(TypeName = "datetime")]
    public DateTime? Date { get; set; }

    [Column("ID")]
    public int? Id { get; set; }

    [StringLength(30)]
    public string? MotileNo { get; set; }

    [StringLength(70)]
    public string? CollectionMethod { get; set; }

    [StringLength(30)]
    public string? ConcentrationNative { get; set; }

    [StringLength(30)]
    public string? ConcentrationAfterPrep { get; set; }

    [StringLength(30)]
    public string? OverallMotilityNative { get; set; }

    [StringLength(30)]
    public string? OverallMotilityPrep { get; set; }

    [StringLength(30)]
    public string? ProgressiveMotilityNativ { get; set; }

    [StringLength(30)]
    public string? ProgressiveMotilityPrep { get; set; }

    [StringLength(30)]
    public string? NormalFormsNative { get; set; }

    [StringLength(30)]
    public string? NormalFormsPrep { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("IvfmaleFhid")]
    [InverseProperty("IvfmaleFhsemenAnalysis")]
    public virtual IvfmaleFertilityHistory IvfmaleFh { get; set; } = null!;
}
