using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.Registration
{
    public class RegPatientDetails
    {
        //public long? PatientId { get; set; }
        public string? StreetName { get; set; }
        public string? DwellingNumber { get; set; }
        [Required(ErrorMessage = "Select Country.")]
        public int? CountryId { get; set; }
        [Required(ErrorMessage = "Select State.")]
        public int? StateId { get; set; }
        [Required(ErrorMessage = "Select City.")]
        public int? CityId { get; set; }
        public string PostalCode { get; set; }
        [Required(ErrorMessage = "Phone No is required.")]
        public string CellPhone { get; set; }
        public string HomePhone { get; set; }
        public string WorkPhone { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        [Required(ErrorMessage = "Select Relation.")]
        public int? RelationshipId { get; set; }
        public string FullName { get; set; }
        public string NationalId { get; set; }
        [Required(ErrorMessage = "Select Gender.")]
        public int? GenderId { get; set; }
        public string ProofOfIncome { get; set; }
        public long? ProviderId { get; set; }
        public int? FinancialClassId { get; set; }
        public int? FeeScheduleId { get; set; }
        public int? LocationId { get; set; }
        public int? SiteId { get; set; }
        public DateTime? SignedDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public int? EntityTypeId { get; set; }
        public int? ProviderReferredId { get; set; }
        public int? TabsTypeId { get; set; }
        public bool? Active { get; set; }
        public string? EfirstName { get; set; }

        public string? EmiddleName { get; set; }

        public string? ElastName { get; set; }

        public string? EstreetName { get; set; }

        public string? EdwellingNumber { get; set; }

        public int? EcountryId { get; set; }

        public int? EstateId { get; set; }

        public int? EcityId { get; set; }

        public int? EpostalCode { get; set; }

        public string? EcellPhone { get; set; }

        public string? EhomePhone { get; set; }

        public string? EworkPhone { get; set; }

        public int? nrelationshipId { get; set; }

        public string? nfirstName { get; set; }

        public string? nmiddleName { get; set; }

        public string? nlastName { get; set; }

        public string? nstreetName { get; set; }

        public int? ndwellingNumber { get; set; }

        public int? ncountryId { get; set; }

        public int? nstateId { get; set; }

        public int? ncityId { get; set; }

        public int? npostalCode { get; set; }

        public string? ncellPhone { get; set; }

        public string? nhomePhone { get; set; }

        public string? nworkPhone { get; set; }

        public string? sfirstName { get; set; }

        public string? smiddleName { get; set; }

        public string? slastName { get; set; }

        public int? sgenderId { get; set; }

        public string? pfirstName { get; set; }

        public string? pmiddleName { get; set; }

        public string? plastName { get; set; }

        public string? phomePhone { get; set; }

        public string? pcellPhone { get; set; }

        public string? pemail { get; set; }

        public string? pmotherFirstName { get; set; }

        public string? pmothermiddleName { get; set; }

        public string? pmotherLastName { get; set; }

        public string? pmotherHomePhone { get; set; }

        public string? pmotherCellPhone { get; }

        public string? pmotherEmail { get; set; }

        public string? aproofOfIncome { get; set; }

        public int? aproviderId { get; set; }

        public int? afeeScheduleId { get; set; }

        public int? afinancialClassId { get; set; }

        public int? alocationId { get; set; }

        public int? asiteId { get; set; }

        public DateTime? asignedDate { get; set; }

        public DateTime? aunsignedDate { get; set; }

        public int? aentityTypeId { get; set; }

        public int? aentityNameId { get; set; }

        public int? areferredById { get; set; }

        public int? fmrNo { get; set; }

        public int? faccountTypeId { get; set; }

        public int? fmasterMrNo { get; set; }

        public int? frelationshipId { get; set; }


    }
}
