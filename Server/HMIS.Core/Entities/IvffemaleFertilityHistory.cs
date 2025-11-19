using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFFemaleFertilityHistory")]
public partial class IvffemaleFertilityHistory
{
    [Key]
    [Column("IVFFemaleFHId")]
    public int IvffemaleFhid { get; set; }

    [Column("IVFMainId")]
    public int IvfmainId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? Date { get; set; }

    public int? ProviderId { get; set; }

    [StringLength(15)]
    public string? UnprotectedIntercourseYear { get; set; }

    [StringLength(15)]
    public string? UnprotectedIntercourseMonth { get; set; }

    public long? AdiposityCategoryId { get; set; }

    public long? GenerallyHealthyCategoryId { get; set; }

    [StringLength(100)]
    public string? LongTermMedication { get; set; }

    public long? ChromosomeAnalysisCategoryId { get; set; }

    [Column("CFTRCarrierCategoryId")]
    public long? CftrcarrierCategoryId { get; set; }

    public long? PatencyRightCategoryId { get; set; }

    public long? PatencyLeftCategoryId { get; set; }

    public long? FallopianTubeYearCategoryId { get; set; }

    public int? PrevOperativeTreatmentsCount { get; set; }

    public int? OvarianStimulationsCount { get; set; }

    [Column("IVF_ICSI_TreatmentsCount")]
    public int? IvfIcsiTreatmentsCount { get; set; }

    public bool? HasAlternativePretreatments { get; set; }

    public string? Comment { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("AdiposityCategoryId")]
    [InverseProperty("IvffemaleFertilityHistoryAdiposityCategory")]
    public virtual DropdownConfiguration? AdiposityCategory { get; set; }

    [ForeignKey("CftrcarrierCategoryId")]
    [InverseProperty("IvffemaleFertilityHistoryCftrcarrierCategory")]
    public virtual DropdownConfiguration? CftrcarrierCategory { get; set; }

    [ForeignKey("ChromosomeAnalysisCategoryId")]
    [InverseProperty("IvffemaleFertilityHistoryChromosomeAnalysisCategory")]
    public virtual DropdownConfiguration? ChromosomeAnalysisCategory { get; set; }

    [ForeignKey("FallopianTubeYearCategoryId")]
    [InverseProperty("IvffemaleFertilityHistoryFallopianTubeYearCategory")]
    public virtual DropdownConfiguration? FallopianTubeYearCategory { get; set; }

    [ForeignKey("GenerallyHealthyCategoryId")]
    [InverseProperty("IvffemaleFertilityHistoryGenerallyHealthyCategory")]
    public virtual DropdownConfiguration? GenerallyHealthyCategory { get; set; }

    [InverseProperty("IvffemaleFh")]
    public virtual ICollection<IvffemaleFhimpairmentFactor> IvffemaleFhimpairmentFactor { get; set; } = new List<IvffemaleFhimpairmentFactor>();

    [InverseProperty("IvffemaleFh")]
    public virtual ICollection<IvffemaleFhprevIllness> IvffemaleFhprevIllness { get; set; } = new List<IvffemaleFhprevIllness>();

    [ForeignKey("IvfmainId")]
    [InverseProperty("IvffemaleFertilityHistory")]
    public virtual Ivfmain Ivfmain { get; set; } = null!;

    [ForeignKey("PatencyLeftCategoryId")]
    [InverseProperty("IvffemaleFertilityHistoryPatencyLeftCategory")]
    public virtual DropdownConfiguration? PatencyLeftCategory { get; set; }

    [ForeignKey("PatencyRightCategoryId")]
    [InverseProperty("IvffemaleFertilityHistoryPatencyRightCategory")]
    public virtual DropdownConfiguration? PatencyRightCategory { get; set; }
}
