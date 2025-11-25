using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class DropdownConfiguration
{
    [Key]
    public long ValueId { get; set; }

    public long CategoryId { get; set; }

    [StringLength(255)]
    public string ValueName { get; set; } = null!;

    public int? SortOrder { get; set; }

    public bool IsActive { get; set; }

    [ForeignKey("CategoryId")]
    [InverseProperty("DropdownConfiguration")]
    public virtual DropdownCategory Category { get; set; } = null!;

    [InverseProperty("Status")]
    public virtual ICollection<IvfcryoLevelC> IvfcryoLevelC { get; set; } = new List<IvfcryoLevelC>();

    [InverseProperty("CycleFromAmenorrheaCategory")]
    public virtual ICollection<IvfdashboardTreatmentEpisode> IvfdashboardTreatmentEpisodeCycleFromAmenorrheaCategory { get; set; } = new List<IvfdashboardTreatmentEpisode>();

    [InverseProperty("MainIndicationCategory")]
    public virtual ICollection<IvfdashboardTreatmentEpisode> IvfdashboardTreatmentEpisodeMainIndicationCategory { get; set; } = new List<IvfdashboardTreatmentEpisode>();

    [InverseProperty("PlannedSpermCollectionCategory")]
    public virtual ICollection<IvfdashboardTreatmentEpisode> IvfdashboardTreatmentEpisodePlannedSpermCollectionCategory { get; set; } = new List<IvfdashboardTreatmentEpisode>();

    [InverseProperty("ProtocolCategory")]
    public virtual ICollection<IvfdashboardTreatmentEpisode> IvfdashboardTreatmentEpisodeProtocolCategory { get; set; } = new List<IvfdashboardTreatmentEpisode>();

    [InverseProperty("StimulatedExternallyCategory")]
    public virtual ICollection<IvfdashboardTreatmentEpisode> IvfdashboardTreatmentEpisodeStimulatedExternallyCategory { get; set; } = new List<IvfdashboardTreatmentEpisode>();

    [InverseProperty("StimulationPlannedCategory")]
    public virtual ICollection<IvfdashboardTreatmentEpisode> IvfdashboardTreatmentEpisodeStimulationPlannedCategory { get; set; } = new List<IvfdashboardTreatmentEpisode>();

    [InverseProperty("TreatmentTypeCategory")]
    public virtual ICollection<IvfdashboardTreatmentEpisode> IvfdashboardTreatmentEpisodeTreatmentTypeCategory { get; set; } = new List<IvfdashboardTreatmentEpisode>();

    [InverseProperty("PidembblastIndicationCategory")]
    public virtual ICollection<IvfembblastIndications> IvfembblastIndications { get; set; } = new List<IvfembblastIndications>();

    [InverseProperty("AdiposityCategory")]
    public virtual ICollection<IvffemaleFertilityHistory> IvffemaleFertilityHistoryAdiposityCategory { get; set; } = new List<IvffemaleFertilityHistory>();

    [InverseProperty("CftrcarrierCategory")]
    public virtual ICollection<IvffemaleFertilityHistory> IvffemaleFertilityHistoryCftrcarrierCategory { get; set; } = new List<IvffemaleFertilityHistory>();

    [InverseProperty("ChromosomeAnalysisCategory")]
    public virtual ICollection<IvffemaleFertilityHistory> IvffemaleFertilityHistoryChromosomeAnalysisCategory { get; set; } = new List<IvffemaleFertilityHistory>();

    [InverseProperty("GenerallyHealthyCategory")]
    public virtual ICollection<IvffemaleFertilityHistory> IvffemaleFertilityHistoryGenerallyHealthyCategory { get; set; } = new List<IvffemaleFertilityHistory>();

    [InverseProperty("PatencyLeftCategory")]
    public virtual ICollection<IvffemaleFertilityHistory> IvffemaleFertilityHistoryPatencyLeftCategory { get; set; } = new List<IvffemaleFertilityHistory>();

    [InverseProperty("PatencyRightCategory")]
    public virtual ICollection<IvffemaleFertilityHistory> IvffemaleFertilityHistoryPatencyRightCategory { get; set; } = new List<IvffemaleFertilityHistory>();

    [InverseProperty("MaterialType")]
    public virtual ICollection<IvfmaleCryoPreservation> IvfmaleCryoPreservationMaterialType { get; set; } = new List<IvfmaleCryoPreservation>();

    [InverseProperty("OriginallyFromClinic")]
    public virtual ICollection<IvfmaleCryoPreservation> IvfmaleCryoPreservationOriginallyFromClinic { get; set; } = new List<IvfmaleCryoPreservation>();

    [InverseProperty("ReasonForResearch")]
    public virtual ICollection<IvfmaleCryoPreservation> IvfmaleCryoPreservationReasonForResearch { get; set; } = new List<IvfmaleCryoPreservation>();

    [InverseProperty("Status")]
    public virtual ICollection<IvfmaleCryoPreservation> IvfmaleCryoPreservationStatus { get; set; } = new List<IvfmaleCryoPreservation>();

    [InverseProperty("MaterialType")]
    public virtual ICollection<IvfmaleCryoStraw> IvfmaleCryoStraw { get; set; } = new List<IvfmaleCryoStraw>();

    [InverseProperty("AdiposityCategory")]
    public virtual ICollection<IvfmaleFertilityHistory> IvfmaleFertilityHistoryAdiposityCategory { get; set; } = new List<IvfmaleFertilityHistory>();

    [InverseProperty("CftrcarrierCategory")]
    public virtual ICollection<IvfmaleFertilityHistory> IvfmaleFertilityHistoryCftrcarrierCategory { get; set; } = new List<IvfmaleFertilityHistory>();

    [InverseProperty("ChromosomeAnalysisCategory")]
    public virtual ICollection<IvfmaleFertilityHistory> IvfmaleFertilityHistoryChromosomeAnalysisCategory { get; set; } = new List<IvfmaleFertilityHistory>();

    [InverseProperty("GenerallyHealthyCategory")]
    public virtual ICollection<IvfmaleFertilityHistory> IvfmaleFertilityHistoryGenerallyHealthyCategory { get; set; } = new List<IvfmaleFertilityHistory>();

    [InverseProperty("InfertilityTypeCategory")]
    public virtual ICollection<IvfmaleFhgeneral> IvfmaleFhgeneral { get; set; } = new List<IvfmaleFhgeneral>();

    [InverseProperty("CategoryIdInheritanceNavigation")]
    public virtual ICollection<IvfmaleFhgenetics> IvfmaleFhgenetics { get; set; } = new List<IvfmaleFhgenetics>();

    [InverseProperty("EndocrinopathiesCategory")]
    public virtual ICollection<IvfmaleFhillness> IvfmaleFhillnessEndocrinopathiesCategory { get; set; } = new List<IvfmaleFhillness>();

    [InverseProperty("PreviousTumorCategory")]
    public virtual ICollection<IvfmaleFhillness> IvfmaleFhillnessPreviousTumorCategory { get; set; } = new List<IvfmaleFhillness>();

    [InverseProperty("CategoryIdDiagnosisOfInfectionNavigation")]
    public virtual ICollection<IvfmaleFhinfections> IvfmaleFhinfectionsCategoryIdDiagnosisOfInfectionNavigation { get; set; } = new List<IvfmaleFhinfections>();

    [InverseProperty("CategoryIdPrevInfectionsNavigation")]
    public virtual ICollection<IvfmaleFhinfections> IvfmaleFhinfectionsCategoryIdPrevInfectionsNavigation { get; set; } = new List<IvfmaleFhinfections>();

    [InverseProperty("CategoryIdClinicalVaricoceleNavigation")]
    public virtual ICollection<IvfmaleFhtesticlesAndSem> IvfmaleFhtesticlesAndSemCategoryIdClinicalVaricoceleNavigation { get; set; } = new List<IvfmaleFhtesticlesAndSem>();

    [InverseProperty("CategoryIdDistalSeminalTractNavigation")]
    public virtual ICollection<IvfmaleFhtesticlesAndSem> IvfmaleFhtesticlesAndSemCategoryIdDistalSeminalTractNavigation { get; set; } = new List<IvfmaleFhtesticlesAndSem>();

    [InverseProperty("CategoryIdEtiologicalDiagnosisNavigation")]
    public virtual ICollection<IvfmaleFhtesticlesAndSem> IvfmaleFhtesticlesAndSemCategoryIdEtiologicalDiagnosisNavigation { get; set; } = new List<IvfmaleFhtesticlesAndSem>();

    [InverseProperty("CategoryIdInstrumentalVaricoceleNavigation")]
    public virtual ICollection<IvfmaleFhtesticlesAndSem> IvfmaleFhtesticlesAndSemCategoryIdInstrumentalVaricoceleNavigation { get; set; } = new List<IvfmaleFhtesticlesAndSem>();

    [InverseProperty("CategoryIdKryptorchidismNavigation")]
    public virtual ICollection<IvfmaleFhtesticlesAndSem> IvfmaleFhtesticlesAndSemCategoryIdKryptorchidismNavigation { get; set; } = new List<IvfmaleFhtesticlesAndSem>();

    [InverseProperty("CategoryIdOrchitisNavigation")]
    public virtual ICollection<IvfmaleFhtesticlesAndSem> IvfmaleFhtesticlesAndSemCategoryIdOrchitisNavigation { get; set; } = new List<IvfmaleFhtesticlesAndSem>();

    [InverseProperty("CategoryIdProximalSeminalTractNavigation")]
    public virtual ICollection<IvfmaleFhtesticlesAndSem> IvfmaleFhtesticlesAndSemCategoryIdProximalSeminalTractNavigation { get; set; } = new List<IvfmaleFhtesticlesAndSem>();

    [InverseProperty("CategoryIdTesticleNavigation")]
    public virtual ICollection<IvfmaleFhtesticlesAndSem> IvfmaleFhtesticlesAndSemCategoryIdTesticleNavigation { get; set; } = new List<IvfmaleFhtesticlesAndSem>();

    [InverseProperty("QuantificationPossible")]
    public virtual ICollection<IvfmaleSemenObservation> IvfmaleSemenObservation { get; set; } = new List<IvfmaleSemenObservation>();

    [InverseProperty("PreparationMethod")]
    public virtual ICollection<IvfmaleSemenObservationPreparationMethod> IvfmaleSemenObservationPreparationMethod { get; set; } = new List<IvfmaleSemenObservationPreparationMethod>();

    [InverseProperty("Appearance")]
    public virtual ICollection<IvfmaleSemenSample> IvfmaleSemenSampleAppearance { get; set; } = new List<IvfmaleSemenSample>();

    [InverseProperty("CollectionMethod")]
    public virtual ICollection<IvfmaleSemenSample> IvfmaleSemenSampleCollectionMethod { get; set; } = new List<IvfmaleSemenSample>();

    [InverseProperty("CollectionPlace")]
    public virtual ICollection<IvfmaleSemenSample> IvfmaleSemenSampleCollectionPlace { get; set; } = new List<IvfmaleSemenSample>();

    [InverseProperty("CryoStatus")]
    public virtual ICollection<IvfmaleSemenSample> IvfmaleSemenSampleCryoStatus { get; set; } = new List<IvfmaleSemenSample>();

    [InverseProperty("Purpose")]
    public virtual ICollection<IvfmaleSemenSample> IvfmaleSemenSamplePurpose { get; set; } = new List<IvfmaleSemenSample>();

    [InverseProperty("Smell")]
    public virtual ICollection<IvfmaleSemenSample> IvfmaleSemenSampleSmell { get; set; } = new List<IvfmaleSemenSample>();

    [InverseProperty("Status")]
    public virtual ICollection<IvfmaleSemenSample> IvfmaleSemenSampleStatus { get; set; } = new List<IvfmaleSemenSample>();

    [InverseProperty("Viscosity")]
    public virtual ICollection<IvfmaleSemenSample> IvfmaleSemenSampleViscosity { get; set; } = new List<IvfmaleSemenSample>();

    [InverseProperty("AdverseSideEffectsCategory")]
    public virtual ICollection<IvfoverviewOhss> IvfoverviewOhssAdverseSideEffectsCategory { get; set; } = new List<IvfoverviewOhss>();

    [InverseProperty("OhssdiagnosisCategory")]
    public virtual ICollection<IvfoverviewOhss> IvfoverviewOhssOhssdiagnosisCategory { get; set; } = new List<IvfoverviewOhss>();

    [InverseProperty("PerformedAdditionalMeasuresCategory")]
    public virtual ICollection<IvfperformedAdditionalMeasures> IvfperformedAdditionalMeasures { get; set; } = new List<IvfperformedAdditionalMeasures>();

    [InverseProperty("MeasuresCategory")]
    public virtual ICollection<IvfplannedAdditionalMeasures> IvfplannedAdditionalMeasures { get; set; } = new List<IvfplannedAdditionalMeasures>();

    [InverseProperty("PidpolarBodiesIndicationCategory")]
    public virtual ICollection<IvfpolarBodiesIndications> IvfpolarBodiesIndications { get; set; } = new List<IvfpolarBodiesIndications>();

    [InverseProperty("TreatmentCategory")]
    public virtual ICollection<IvftreatmentTypes> IvftreatmentTypes { get; set; } = new List<IvftreatmentTypes>();
}
