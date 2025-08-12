using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.Coverage
{
    public class InsurancePolicy
    {
        //[Required(ErrorMessage = "Effective Date is required.")]
        public DateTime? EffectiveDate { get; set; }

        //[Required(ErrorMessage = "Termination Date is required.")]
        //[Compare("EffectiveDate", ErrorMessage = "Termination Date must be greater than Effective Date.")]
        public DateTime? TerminationDate { get; set; }

        public string GroupNo { get; set; }
        public int? NoOfVisits { get; set; }
        //[Required(ErrorMessage = "Status is required.")]
        public bool? Status { get; set; }
        public long SubscriberId { get; set; }
        public decimal? Amount { get; set; }

        public bool? IsDeleted { get; set; }

        public int InsuredPolicyId { get; set;}
    }
}
