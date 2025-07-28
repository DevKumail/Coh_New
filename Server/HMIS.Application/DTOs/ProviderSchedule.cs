using HMIS.Data.Validations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs
{
    //[AtLeastOneDaySelected(ErrorMessage = "At least one day must be selected.")]
    public class ProviderSchedule
    {
        public long PSId { get; set; }
        [Required(ErrorMessage = "Please select Provider.")]
        public long ProviderId { get; set; }
        [Required(ErrorMessage = "Please select Site.")]
        public int SiteId { get; set; }
        [Required(ErrorMessage = "Please select Usage.")]
        public int UsageId { get; set; }
        [Required(ErrorMessage = "Please select Usage.")]
        public string StartTime { get; set; }
        [Required(ErrorMessage = "Please select Usage.")]
        public string EndTime { get; set; }
        // public long? Days { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? BreakStartTime { get; set; }
        public string? BreakEndTime { get; set; }
        public string? BreakReason { get; set; }
        public short? AppPerHour { get; set; }
        public short? MaxOverloadApps { get; set; }
        public int? Priority { get; set; }
        public int FacilityId { get; set; }
        public bool Active { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public bool? Sunday { get; set; }
        public bool? Monday { get; set; }
        public bool? Tuesday { get; set; }
        public bool? Wednesday { get; set; }
        public bool? Thursday { get; set; }
        public bool? Friday { get; set; }
        public bool? Saturday { get; set; }
        public bool IsDeleted { get; set; }
        public int? SpecialityId { get; set; }
        public List<ProviderScheduleByAppType> providerScheduleByAppType { get; set; }

    }
}