using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.Coverage
{
    public class InsuranceSubscriber
    {
        public long SubscriberID { get; set; }
        //[Required(ErrorMessage = "Select Insurance Carrier.")]
        public int CarrierId { get; set; }
        //[Required(ErrorMessage = "Enter HICN.")]
        public string InsuredIDNo { get; set; }
        public string InsuranceTypeCode { get; set; }
        public string InsuredGroupOrPolicyNo { get; set; }
        //[Required(ErrorMessage = "Select Policy.")]
        public string InsuredGroupOrPolicyName { get; set; }
        //[Required(ErrorMessage = "Enter Type Code.")]
        public byte CompanyOrIndividual { get; set; }
        //public string EffectiveDate { get; set; }
        //public string TerminationDate { get; set; }
        public decimal Copay { get; set; }
        public string Suffix { get; set; }
        //[Required(ErrorMessage = "Enter First Name.")]
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        //[Required(ErrorMessage = "Enter Last Name.")]
        public string LastName { get; set; }
        //[Required(ErrorMessage = "Enter Date Of Birth.")]
        public DateTime BirthDate { get; set; }
        //[Required(ErrorMessage = "Select Gender")]
        public string Sex { get; set; }
        // public string Weight { get; set; }
        //[Required(ErrorMessage = "Enter Phone No.")]
        //[RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number should contain exactly 10 digits.")]
        public string InsuredPhone { get; set; }
        public string OtherPhone { get; set; }
        // public string SSN { get; set; }
        // public string EmployerOrSchoolName { get; set; }
        public string Address1 { get; set; }
        public string? Address2 { get; set; }
        public string ZipCode { get; set; }
        public int CityId { get; set; }
        public int StateId { get; set; }
        public int CountryId { get; set; }
        public bool Inactive { get; set; }
        public string EnteredBy { get; set; }
        //   public string EntryDate { get; set; }
        public bool Verified { get; set; }
        public bool ChkDeductible { get; set; }
        public decimal? Deductibles { get; set; }
        public decimal? DNDeductible { get; set; }
        public decimal? OpCopay { get; set; }
         public long PayerPackageId { get; set; }

        public string? MRNo { get; set; }
        public Byte? CoverageOrder { get; set; }
        public bool? IsSelected { get; set; }


        public List<InsurancePolicy>? regInsurancePolicy { get; set; }

        public List<Deduct>? regDeduct { get; set; }


    }


    public class CoverageOrderRequest
    {
        public int SubscriberId { get; set; }
        public string MRNo { get; set; }
        public int CoverageOrder { get; set; }
    }

}
