using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.AppointmentDTOs
{
    public class ViewAppointments
    {
        public long? ProviderId { get; set; }

        [Required(ErrorMessage = "AppDate is required.")]
        public DateTime AppDate { get; set; }

        public int? SiteId { get; set; }
        public int? LocationId { get; set; }

        [Required(ErrorMessage = "FacilityId is required.")]
        public int FacilityId { get; set; }

        public int? SpecialtyId { get; set; }
    }
}
