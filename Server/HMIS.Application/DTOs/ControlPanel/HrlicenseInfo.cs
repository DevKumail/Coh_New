using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.ControlPanel
{
    public class HrlicenseInfo
    {
        public long HRLicenseId { get; set; }
        public int EmployeeId { get; set; }

        public string? LicenseName { get; set; }

        public string? LicenseNo { get; set; }

        public DateTime? ExpiryDate { get; set; }

        public bool Active { get; set; }
    }
}
