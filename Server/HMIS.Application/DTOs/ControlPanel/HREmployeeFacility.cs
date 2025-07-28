using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.ControlPanel
{
    public class HREmployeeFacility
    {
        public long EmployeeFacilityID { get; set; }
        public int EmployeeId { get; set; }

        public int FacilityID { get; set; }

        public DateTime? CreatedOn { get; set; }

        public string? CreatedBy { get; set; }

        public DateTime? UpdatedOn { get; set; }

        public string? UpdatedBy { get; set; }
    }
}
