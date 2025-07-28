using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.DashBoardDTOs.CommonDTOs
{
    public class TodaysAppointmentDTO
    {
        public string MRNo { get; set; }
        public string PatientName { get; set; }
        public string ProviderName { get; set; }
        public int? FacilityId { get; set; }
        public string FacilityName { get; set; }
        public int? SiteId { get; set; }
        public string SiteName { get; set; }
        public DateTime AppDateTime { get; set; }
    }
}
