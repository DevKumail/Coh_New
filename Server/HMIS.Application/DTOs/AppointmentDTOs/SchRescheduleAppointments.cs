using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.AppointmentDTOs
{
    public class SchRescheduleAppointments
    {
        public long AppId { get; set; }
        [Required(ErrorMessage = "Select Provider Name.")]
        public long ProviderId { get; set; }

        [Required(ErrorMessage = "Appointment Time Required.")]
        public DateTime AppDateTime { get; set; }

        [Required(ErrorMessage = "Select Appointment Status.")]
        public int AppStatusId { get; set; }

        [Required(ErrorMessage = "Select Site Name.")]
        public int SiteId { get; set; }

        [Required(ErrorMessage = "Select Facility Name.")]
        public int FacilityId { get; set; }
        public int LocationId { get; set; }

        public string? Reason { get; set; }
    }
}