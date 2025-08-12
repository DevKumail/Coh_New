using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.ControlPanel
{
    public class PersonalReminder
    {
        public int EmployeeId { get; set; }
        public string ReminderText { get; set; }
        public DateTime ReminderDateTime { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
    }
}
