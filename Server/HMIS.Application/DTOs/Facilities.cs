using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs
{
    public class Facilities
    {
        public long? EmployeeId { get; set; }
        public long? FacilityId { get; set; }
        public long? CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string? FacilityName { get; set; }
    }
}
