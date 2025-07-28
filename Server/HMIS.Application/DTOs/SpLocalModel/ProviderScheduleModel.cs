using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.SpLocalModel
{
    public class ProviderScheduleModel
    {
        public int? ProviderId { get; set; }
        public int? SiteId { get; set; }
        public int? SpecialityId { get; set; }
        public int? FacilityId { get; set; }
        public int? UsageId { get; set; }
        public bool? Sunday { get; set; }
        public bool? Monday { get; set; }
        public bool? Tuesday { get; set; }
        public bool? Wednesday { get; set; }
        public bool? Thursday { get; set; }
        public bool? Friday { get; set; }
        public bool? Saturday { get; set; }
        public string? StartTime { get; set; }
        public string? EndTime { get; set; }
        public int? Priority { get; set; }
        public int? OffsetValue { get; set; }
        public int? PagingSize { get; set; }

        public class FilterProviderScheduleListRequest
        {
            public ProviderScheduleModel? ProviderScheduleList { get; set; }
            public PaginationInfo? PaginationInfo { get; set; }
        }
    }
}
