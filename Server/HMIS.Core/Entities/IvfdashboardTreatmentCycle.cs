using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFDashboardTreatmentCycle")]
public partial class IvfdashboardTreatmentCycle
{
    [Key]
    [Column("IVFDashboardTreatmentCycleId")]
    public int IvfdashboardTreatmentCycleId { get; set; }

    [Column("IVFMainId")]
    public int? IvfmainId { get; set; }

    [Column("IVFMaleFHId")]
    public int? IvfmaleFhid { get; set; }

    [Column("IVFFemaleFHId")]
    public int? IvffemaleFhid { get; set; }

    public long? TreatmentTypeCategoryId { get; set; }

    public bool? OnlyInternalCycle { get; set; }

    [Column("DateofLMP", TypeName = "datetime")]
    public DateTime? DateofLmp { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? TherapyStartDate { get; set; }

    public long? CycleFromAmenorrheaCategoryId { get; set; }

    public long? MainIndicationCategoryId { get; set; }

    public long? ProtocolCategoryId { get; set; }

    public long? StimulationPlannedCategoryId { get; set; }

    public long? StimulatedExternallyCategoryId { get; set; }

    [StringLength(50)]
    public string? LongTermMedication { get; set; }

    public int? PlannedNo { get; set; }

    public long? PlannedSpermCollectionCategoryId { get; set; }

    public long? ProviderId { get; set; }

    [StringLength(50)]
    public string? RandomizationGroup { get; set; }

    [StringLength(50)]
    public string? Survey { get; set; }

    [StringLength(100)]
    public string? TakenOverFrom { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? TakeOverOn { get; set; }

    public string? CycleNote { get; set; }

    public bool CycleStatus { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("CycleFromAmenorrheaCategoryId")]
    [InverseProperty("IvfdashboardTreatmentCycleCycleFromAmenorrheaCategory")]
    public virtual DropdownConfiguration? CycleFromAmenorrheaCategory { get; set; }

    [InverseProperty("IvfdashboardTreatmentEpisode")]
    public virtual IvfdashboardAdditionalMeasures? IvfdashboardAdditionalMeasures { get; set; }

    [ForeignKey("IvffemaleFhid")]
    [InverseProperty("IvfdashboardTreatmentCycle")]
    public virtual IvffemaleFertilityHistory? IvffemaleFh { get; set; }

    [ForeignKey("IvfmainId")]
    [InverseProperty("IvfdashboardTreatmentCycle")]
    public virtual Ivfmain? Ivfmain { get; set; }

    [ForeignKey("IvfmaleFhid")]
    [InverseProperty("IvfdashboardTreatmentCycle")]
    public virtual IvfmaleFertilityHistory? IvfmaleFh { get; set; }

    [InverseProperty("IvfdashboardTreatmentCycle")]
    public virtual IvftreatmentEpisodeAspirationStage? IvftreatmentEpisodeAspirationStage { get; set; }

    [InverseProperty("IvfdashboardTreatmentCycle")]
    public virtual ICollection<IvftreatmentEpisodeOverviewStage> IvftreatmentEpisodeOverviewStage { get; set; } = new List<IvftreatmentEpisodeOverviewStage>();

    [InverseProperty("IvfdashboardTreatmentCycle")]
    public virtual ICollection<IvftreatmentEpisodeTransferStage> IvftreatmentEpisodeTransferStage { get; set; } = new List<IvftreatmentEpisodeTransferStage>();

    [InverseProperty("IvfdashboardTreatmentEpisode")]
    public virtual ICollection<IvftreatmentEpisodesAttachments> IvftreatmentEpisodesAttachments { get; set; } = new List<IvftreatmentEpisodesAttachments>();

    [InverseProperty("IvfdashboardTreatmentCycle")]
    public virtual ICollection<IvftreatmentPlannedSpermCollection> IvftreatmentPlannedSpermCollection { get; set; } = new List<IvftreatmentPlannedSpermCollection>();

    [InverseProperty("IvfdashboardTreatmentEpisode")]
    public virtual ICollection<IvftreatmentTypes> IvftreatmentTypes { get; set; } = new List<IvftreatmentTypes>();

    [ForeignKey("MainIndicationCategoryId")]
    [InverseProperty("IvfdashboardTreatmentCycleMainIndicationCategory")]
    public virtual DropdownConfiguration? MainIndicationCategory { get; set; }

    [ForeignKey("PlannedSpermCollectionCategoryId")]
    [InverseProperty("IvfdashboardTreatmentCyclePlannedSpermCollectionCategory")]
    public virtual DropdownConfiguration? PlannedSpermCollectionCategory { get; set; }

    [ForeignKey("ProtocolCategoryId")]
    [InverseProperty("IvfdashboardTreatmentCycleProtocolCategory")]
    public virtual DropdownConfiguration? ProtocolCategory { get; set; }

    [ForeignKey("ProviderId")]
    [InverseProperty("IvfdashboardTreatmentCycle")]
    public virtual Hremployee? Provider { get; set; }

    [ForeignKey("StimulatedExternallyCategoryId")]
    [InverseProperty("IvfdashboardTreatmentCycleStimulatedExternallyCategory")]
    public virtual DropdownConfiguration? StimulatedExternallyCategory { get; set; }

    [ForeignKey("StimulationPlannedCategoryId")]
    [InverseProperty("IvfdashboardTreatmentCycleStimulationPlannedCategory")]
    public virtual DropdownConfiguration? StimulationPlannedCategory { get; set; }

    [ForeignKey("TreatmentTypeCategoryId")]
    [InverseProperty("IvfdashboardTreatmentCycleTreatmentTypeCategory")]
    public virtual DropdownConfiguration? TreatmentTypeCategory { get; set; }
}
