using System;
using System.Collections.Generic;

namespace HMIS.Application.DTOs.IVFDTOs
{
    public class IVFDashboardTreatmentCycleListDto
    {
        public int TotalRecords { get; set; }
        public List<IVFDashboardTreatmentCycleListItemDto> Data { get; set; } = new();
    }

    public class IVFDashboardTreatmentCycleListItemDto
    {
        public int IVFDashboardTreatmentCycleId { get; set; }
        public long? TreatmentTypeCategoryId { get; set; }
        public string? TreatmentType { get; set; }
        public DateTime? DateOfLMP { get; set; }
        public int IVFMainId { get; set; }
    }
}
