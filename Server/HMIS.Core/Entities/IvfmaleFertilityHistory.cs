using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleFertilityHistory")]
public partial class IvfmaleFertilityHistory
{
    [Key]
    [Column("IVFMaleFHId")]
    public int IvfmaleFhid { get; set; }

    [Column("IVFMainId")]
    public int IvfmainId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? Date { get; set; }

    public long? ProviderId { get; set; }

    public long? AdiposityCategoryId { get; set; }

    public long? GenerallyHealthyCategoryId { get; set; }

    [StringLength(250)]
    public string? LongTermMedication { get; set; }

    public int? NoOfPregnanciesAchieved { get; set; }

    public long? ChromosomeAnalysisCategoryId { get; set; }

    [Column("CFTRCarrierCategoryId")]
    public long? CftrcarrierCategoryId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("AdiposityCategoryId")]
    [InverseProperty("IvfmaleFertilityHistoryAdiposityCategory")]
    public virtual DropdownConfiguration? AdiposityCategory { get; set; }

    [ForeignKey("CftrcarrierCategoryId")]
    [InverseProperty("IvfmaleFertilityHistoryCftrcarrierCategory")]
    public virtual DropdownConfiguration? CftrcarrierCategory { get; set; }

    [ForeignKey("ChromosomeAnalysisCategoryId")]
    [InverseProperty("IvfmaleFertilityHistoryChromosomeAnalysisCategory")]
    public virtual DropdownConfiguration? ChromosomeAnalysisCategory { get; set; }

    [ForeignKey("GenerallyHealthyCategoryId")]
    [InverseProperty("IvfmaleFertilityHistoryGenerallyHealthyCategory")]
    public virtual DropdownConfiguration? GenerallyHealthyCategory { get; set; }

    [InverseProperty("IvfmaleFh")]
    public virtual ICollection<IvffemaleTreatmentCycle> IvffemaleTreatmentCycle { get; set; } = new List<IvffemaleTreatmentCycle>();

    [ForeignKey("IvfmainId")]
    [InverseProperty("IvfmaleFertilityHistory")]
    public virtual Ivfmain Ivfmain { get; set; } = null!;

    [InverseProperty("IvfmaleFh")]
    public virtual ICollection<IvfmaleFhgeneral> IvfmaleFhgeneral { get; set; } = new List<IvfmaleFhgeneral>();

    [InverseProperty("IvfmaleFh")]
    public virtual ICollection<IvfmaleFhgenetics> IvfmaleFhgenetics { get; set; } = new List<IvfmaleFhgenetics>();

    [InverseProperty("IvfmaleFh")]
    public virtual ICollection<IvfmaleFhimpairmentFactor> IvfmaleFhimpairmentFactor { get; set; } = new List<IvfmaleFhimpairmentFactor>();

    [InverseProperty("IvfmaleFh")]
    public virtual ICollection<IvfmaleFhprevIllness> IvfmaleFhprevIllness { get; set; } = new List<IvfmaleFhprevIllness>();

    [InverseProperty("IvfmaleFh")]
    public virtual ICollection<IvfmaleFhsemenAnalysis> IvfmaleFhsemenAnalysis { get; set; } = new List<IvfmaleFhsemenAnalysis>();

    [InverseProperty("IvfmaleFh")]
    public virtual ICollection<IvfmaleFhtesticlesAndSem> IvfmaleFhtesticlesAndSem { get; set; } = new List<IvfmaleFhtesticlesAndSem>();

    [ForeignKey("ProviderId")]
    [InverseProperty("IvfmaleFertilityHistory")]
    public virtual Hremployee? Provider { get; set; }
}
