using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.Registration
{
    public class RegPatientEmployer
    {
        // public long? PatientId { get; set; }
        public int? EmploymentOccupationId { get; set; }
        public int? EmploymentTypeId { get; set; }
        public int? EmploymentStatusId { get; set; }
        public string? EmploymentCompanyName { get; set; }
    }
}

