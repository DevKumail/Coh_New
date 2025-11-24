using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFDashboardTreatmentEpisode")]
public partial class IvfdashboardTreatmentEpisode
{
    [Key]
    [Column("IVFDashboardTreatmentEpisodeId")]
    public int IvfdashboardTreatmentEpisodeId { get; set; }

    [Column("IVFMainId")]
    public int? IvfmainId { get; set; }

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

    public string? CycleNote { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("CycleFromAmenorrheaCategoryId")]
    [InverseProperty("IvfdashboardTreatmentEpisodeCycleFromAmenorrheaCategory")]
    public virtual DropdownConfiguration? CycleFromAmenorrheaCategory { get; set; }

    [InverseProperty("IvfdashboardTreatmentEpisode")]
    public virtual ICollection<IvfdashboardAdditionalMeasures> IvfdashboardAdditionalMeasures { get; set; } = new List<IvfdashboardAdditionalMeasures>();

    [ForeignKey("IvfmainId")]
    [InverseProperty("IvfdashboardTreatmentEpisode")]
    public virtual Ivfmain? Ivfmain { get; set; }

    [InverseProperty("IvfdashboardTreatmentEpisode")]
    public virtual ICollection<IvftreamentsEpisodeAttachments> IvftreamentsEpisodeAttachments { get; set; } = new List<IvftreamentsEpisodeAttachments>();

    [InverseProperty("IvfdashboardTreatmentEpisode")]
    public virtual ICollection<IvftreatmentEpisodeOverviewStage> IvftreatmentEpisodeOverviewStage { get; set; } = new List<IvftreatmentEpisodeOverviewStage>();

    [InverseProperty("IvfdashboardTreatmentEpisode")]
    public virtual ICollection<IvftreatmentTypes> IvftreatmentTypes { get; set; } = new List<IvftreatmentTypes>();

    [ForeignKey("MainIndicationCategoryId")]
    [InverseProperty("IvfdashboardTreatmentEpisodeMainIndicationCategory")]
    public virtual DropdownConfiguration? MainIndicationCategory { get; set; }

    [ForeignKey("PlannedSpermCollectionCategoryId")]
    [InverseProperty("IvfdashboardTreatmentEpisodePlannedSpermCollectionCategory")]
    public virtual DropdownConfiguration? PlannedSpermCollectionCategory { get; set; }

    [ForeignKey("ProtocolCategoryId")]
    [InverseProperty("IvfdashboardTreatmentEpisodeProtocolCategory")]
    public virtual DropdownConfiguration? ProtocolCategory { get; set; }

    [ForeignKey("StimulatedExternallyCategoryId")]
    [InverseProperty("IvfdashboardTreatmentEpisodeStimulatedExternallyCategory")]
    public virtual DropdownConfiguration? StimulatedExternallyCategory { get; set; }

    [ForeignKey("StimulationPlannedCategoryId")]
    [InverseProperty("IvfdashboardTreatmentEpisodeStimulationPlannedCategory")]
    public virtual DropdownConfiguration? StimulationPlannedCategory { get; set; }

    [ForeignKey("TreatmentTypeCategoryId")]
    [InverseProperty("IvfdashboardTreatmentEpisodeTreatmentTypeCategory")]
    public virtual DropdownConfiguration? TreatmentTypeCategory { get; set; }
}
