using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.Coverage
{
    public class InsurenceEligibility
    {

        public int? VisitAccountNo { get; set; }


        public string PatientName { get; set; }


        public string InsurancePayerName { get; set; }

        public string InsuranceMemberID { get; set; }


        public string PackageName { get; set; }


        public int? PackageId { get; set; }


        public DateTime? EffectiveDate { get; set; }


        public DateTime? ExpiryDate { get; set; }

        public string PolicyNumber { get; set; }

        public byte[] Image { get; set; }

        public long? BlPayerId { get; set; }

        public string? CreatedOn { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? UpdatedOn { get; }

        public string UpdatedBy { get; set; }

        public string Message { get; set; }
    }
}
