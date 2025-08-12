using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs
{
    public class HolidaySchedule
    {

        public long? HolidayScheduleId { get; set; }

        [Required(ErrorMessage = "IsHoliday is required.")]
        public bool? IsHoliday { get; set; }

        [Required(ErrorMessage = "HolidayName is required.")]
        public string? HolidayName { get; set; }


        public string? Comments { get; set; }

        [Required(ErrorMessage = "SiteID is required.")]
        public int? SiteID { get; set; }

        [Required(ErrorMessage = "Years is required.")]
        [RegularExpression(@"^\d+$", ErrorMessage = "Years should contain only numeric digits.")]
        [StringLength(4, ErrorMessage = "Years should be a maximum of 4 digits.")]
        public string? Years { get; set; }

        [Required(ErrorMessage = "MonthDay is required.")]
        [RegularExpression(@"^\d+$", ErrorMessage = "MonthDay should contain only numeric digits.")]
        [StringLength(4, ErrorMessage = "MonthDay should be a maximum of 4 digits.")]
        public string? MonthDay { get; set; }

        [RegularExpression(@"^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$", ErrorMessage = "Starting time should be in the format 'hh:mm tt'.")]
        public string? StartingTime { get; set; }

        [RegularExpression(@"^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$", ErrorMessage = "Ending time should be in the format 'hh:mm tt'.")]
        public string? EndingTime { get; set; }

        public bool? IsActive { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdateBy { get; set; }
    }
}
