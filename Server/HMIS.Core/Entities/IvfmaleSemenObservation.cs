using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleSemenObservation")]
public partial class IvfmaleSemenObservation
{
    [Key]
    public int ObservationId { get; set; }

    public int SampleId { get; set; }

    [StringLength(50)]
    public string ObservationType { get; set; } = null!;

    [Column("VolumeML", TypeName = "decimal(5, 2)")]
    public decimal? VolumeMl { get; set; }

    [Column("PHValue", TypeName = "decimal(4, 2)")]
    public decimal? Phvalue { get; set; }

    [Column("ConcentrationPerML", TypeName = "decimal(12, 4)")]
    public decimal? ConcentrationPerMl { get; set; }

    public bool? ConcLessThanPointOne { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? VitalityPercent { get; set; }

    [Column(TypeName = "decimal(12, 4)")]
    public decimal? Leukocytesml { get; set; }

    [Column(TypeName = "decimal(12, 4)")]
    public decimal? RoundCellsml { get; set; }

    [Column("WHO_AB_Percent", TypeName = "decimal(5, 2)")]
    public decimal? WhoAbPercent { get; set; }

    [Column("WHO_C_Percent", TypeName = "decimal(5, 2)")]
    public decimal? WhoCPercent { get; set; }

    [Column("WHO_D_Percent", TypeName = "decimal(5, 2)")]
    public decimal? WhoDPercent { get; set; }

    [Column(TypeName = "decimal(12, 4)")]
    public decimal? ProgressiveMotile { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? OverallMotilityPercent { get; set; }

    public long? QuantificationPossibleId { get; set; }

    [Column(TypeName = "decimal(12, 4)")]
    public decimal? TotalSpermCount { get; set; }

    [Column(TypeName = "decimal(12, 4)")]
    public decimal? PeroxidasePositive { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? ImmunobeadAdherentPercent { get; set; }

    [Column("MARTesPercent", TypeName = "decimal(5, 2)")]
    public decimal? MartesPercent { get; set; }

    [Column("MAR_IgG_Percent", TypeName = "decimal(5, 2)")]
    public decimal? MarIgGPercent { get; set; }

    [Column("MAR_IgA_Percent", TypeName = "decimal(5, 2)")]
    public decimal? MarIgAPercent { get; set; }

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

    [Column(TypeName = "decimal(6, 3)")]
    public decimal? TeratozoospermiaIndex { get; set; }

    public DateOnly? PreparationDate { get; set; }

    public TimeOnly? PreparationTime { get; set; }

    public int? PreparedById { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdateBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
