using System;
using System.Collections.Generic;

namespace HMIS.Application.DTOs.IVFDTOs
{
    public class IVFDashboardFertilityHistoryDto
    {
        public int IVFMainId { get; set; }

        public List<IVFDashboardMaleFertilityHistoryItemDto> MaleFertilityHistory { get; set; } = new();
        public List<IVFDashboardFemaleFertilityHistoryItemDto> FemaleFertilityHistory { get; set; } = new();
    }

    public class IVFDashboardMaleFertilityHistoryItemDto
    {
        public int IVFMaleFHId { get; set; }
        public DateTime? Date { get; set; }
        public string? ChromosomeAnalysis { get; set; }

        public string? PrevIllnessCodes { get; set; }
        public List<IVFDashboardPrevIllnessItemDto>? PrevIllnessList { get; set; }
    }

    public class IVFDashboardFemaleFertilityHistoryItemDto
    {
        public int IVFFemaleFHId { get; set; }
        public DateTime? Date { get; set; }
        public string? ChromosomeAnalysis { get; set; }

        public string? PrevIllnessCodes { get; set; }
        public List<IVFDashboardPrevIllnessItemDto>? PrevIllnessList { get; set; }
    }

    public class IVFDashboardPrevIllnessItemDto
    {
        public string? IllnessCode { get; set; }
        public string? DescriptionFull { get; set; }
    }
}
