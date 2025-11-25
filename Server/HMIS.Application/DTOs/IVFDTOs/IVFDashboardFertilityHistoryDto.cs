using System;
using System.Collections.Generic;

namespace HMIS.Application.DTOs.IVFDTOs
{
    public class IVFDashboardFertilityHistoryDto
    {
        public int TotalRecords { get; set; }
        public List<IVFDashboardFertilityHistoryItemDto> Data { get; set; } = new();
    }

    public class IVFDashboardFertilityHistoryItemDto
    {
        public int IVFDashboardTreatmentEpisodeId { get; set; }
        public long? TreatmentTypeCategoryId { get; set; }
        public string? TreatmentType { get; set; }
        public DateTime? DateOfLMP { get; set; }
        public int IVFMainId { get; set; }
    }
}
