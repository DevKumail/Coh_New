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
    public string? ObservationType { get; set; }

    [Column("VolumeML", TypeName = "decimal(10, 2)")]
    public decimal? VolumeMl { get; set; }

    [Column("PHValue", TypeName = "decimal(4, 2)")]
    public decimal? Phvalue { get; set; }

    [Column("ConcentrationPerML", TypeName = "decimal(18, 2)")]
    public decimal? ConcentrationPerMl { get; set; }

    public bool? ConcLessThanPointOne { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? VitalityPercent { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Leukocytesml { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? RoundCellsml { get; set; }

    public long? QuantificationPossibleId { get; set; }

    public int? TotalSpermCount { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? PeroxidasePositive { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? ImmunobeadAdherentPercent { get; set; }

    [Column("MARTesPercent", TypeName = "decimal(5, 2)")]
    public decimal? MartesPercent { get; set; }

    [Column("MAR_IgG_Percent", TypeName = "decimal(5, 2)")]
    public decimal? MarIgGPercent { get; set; }

    [Column("MAR_IgA_Percent", TypeName = "decimal(5, 2)")]
    public decimal? MarIgAPercent { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedAt { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedAt { get; set; }

    [ForeignKey("QuantificationPossibleId")]
    [InverseProperty("IvfmaleSemenObservation")]
    public virtual DropdownConfiguration? QuantificationPossible { get; set; }

    [ForeignKey("SampleId")]
    [InverseProperty("IvfmaleSemenObservation")]
    public virtual IvfmaleSemenSample Sample { get; set; } = null!;
}
