using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.DashBoardDTOs.CommonDTOs
{
    public class DoctorAvailabilityDTO
    {
        public string ProviderName { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int? FacilityId { get; set; }
        public string AvailableDays { get; set; }
        public long ProviderId { get; set; }
        public string FacilityName { get; set; }
    }
}
