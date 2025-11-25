using System;
using System.Collections.Generic;

namespace HMIS.Application.DTOs.IVFDTOs
{
    public class IVFDashboardTreatmentEpisodeDto
    {
        public int? IVFDashboardTreatmentEpisodeId { get; set; }
        public int? IVFMainId { get; set; }

        public long? TreatmentTypeCategoryId { get; set; }
        public bool? OnlyInternalCycle { get; set; }
        public DateTime? DateOfLMP { get; set; }
        public DateTime? TherapyStartDate { get; set; }
        public long? CycleFromAmenorrheaCategoryId { get; set; }
        public long? MainIndicationCategoryId { get; set; }
        public long? ProtocolCategoryId { get; set; }
        public long? StimulationPlannedCategoryId { get; set; }
        public long? StimulatedExternallyCategoryId { get; set; }
        public string? LongTermMedication { get; set; }
        public int? PlannedNo { get; set; }
        public long? PlannedSpermCollectionCategoryId { get; set; }

        public long? ProviderId { get; set; }
        public string? RandomizationGroup { get; set; }
        public string? Survey { get; set; }
        public string? TakenOverFrom { get; set; }
        public DateTime? TakeOverOn { get; set; }

        public string? CycleNote { get; set; }

        public List<long>? PlannedSpermCollectionCategoryIds { get; set; }

        public List<IVFDashboardTreatmentSubTypeDto>? TreatmentSubTypes { get; set; }

        public IVFDashboardAdditionalMeasureDto? AdditionalMeasure { get; set; }

        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
    }

    public class IVFDashboardTreatmentSubTypeDto
    {
        public long? TreatmentCategoryId { get; set; }
    }

    public class IVFDashboardAdditionalMeasureDto
    {
        public int? IVFAdditionalMeasuresId { get; set; }
        public string? GeneralCondition { get; set; }

        public List<long>? PlannedAdditionalMeasuresCategoryIds { get; set; }
        public List<long>? PerformedAdditionalMeasuresCategoryIds { get; set; }
        public List<long>? PolarBodiesIndicationCategoryIds { get; set; }
        public List<long>? EMBBlastIndicationCategoryIds { get; set; }
    }
}
