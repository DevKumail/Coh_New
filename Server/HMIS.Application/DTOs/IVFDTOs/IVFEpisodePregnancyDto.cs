using System;
using System.Collections.Generic;

namespace HMIS.Application.DTOs.IVFDTOs
{
    public class IVFEpisodePregnancyDto
    {
        public long? PregnancyId { get; set; }
        public int? IVFDashboardTreatmentCycleId { get; set; }
        public int? StatusId { get; set; }

        public IVFEpisodePregnancyPregnancyDetailsDto? Progress { get; set; }
    }

    public class IVFEpisodePregnancyPregnancyDetailsDto
    {
        public long? Id { get; set; }
        public long? PregnancyId { get; set; }

        public long? CycleOutcomeCategoryId { get; set; }
        public long? PositivePgtestCategoryId { get; set; }
        public DateTime? LastbhCGDate { get; set; }

        public IVFEpisodePregnancyUltrasoundDto? Ultrasound { get; set; }
        public IVFEpisodePregnancyProgressDto? Pregnancy { get; set; }
    }

    public class IVFEpisodePregnancyProgressDto
    {
        public DateTime? PregnancyDeterminedOnDate { get; set; }
        public long? IntrauterineCategoryId { get; set; }
        public long? ExtrauterineCategoryId { get; set; }

        public string? Notes { get; set; }
        public long? FetalPathologyComplicationCategoryId { get; set; }

        public List<IVFEpisodePregnancyEmbryoDto>? Embryos { get; set; }
        public List<IVFEpisodePregnancyComplicationUntil20thDto>? ComplicationsUntil20th { get; set; }
        public List<IVFEpisodePregnancyComplicationAfter20thDto>? ComplicationsAfter20th { get; set; }
    }

    public class IVFEpisodePregnancyUltrasoundDto
    {
        public long? UltrasoundId { get; set; }
    }

    public class IVFEpisodePregnancyEmbryoDto
    {
        public long? EmbryoId { get; set; }
        public long? PregnancyId { get; set; }

        public long? PGProgressUntil4thWeekCategoryId { get; set; }
        public string? Note { get; set; }
        public long? ImageId { get; set; }
    }

    public class IVFEpisodePregnancyComplicationUntil20thDto
    {
        public long? ComplicationUntil20thId { get; set; }
        public long? PregnancyId { get; set; }

        public long? ComplicationUntil20thWeekCategoryId { get; set; }
    }

    public class IVFEpisodePregnancyComplicationAfter20thDto
    {
        public long? ComplicationAfter20thId { get; set; }
        public long? PregnancyId { get; set; }

        public long? ComplicationAfter20thWeekCategoryId { get; set; }
    }

    public class IVFEpisodePregnancyListItemDto
    {
        public long PregnancyId { get; set; }
        public int IVFDashboardTreatmentCycleId { get; set; }
        public DateTime? PregnancyDeterminedOnDate { get; set; }
        public long? CycleOutcomeCategoryId { get; set; }
    }
}
