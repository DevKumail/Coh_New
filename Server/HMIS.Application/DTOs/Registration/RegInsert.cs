
using HMIS.Application.DTOs.Demographics;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.Registration
{
    public class RegInsert
    {
        public long? PatientId { get; set; }
        [Required(ErrorMessage = "First Name is required.")]
        public string PersonFirstName { get; set; }
        public string PersonMiddleName { get; set; }
        [Required(ErrorMessage = "Last Name is required.")]
        public string PersonLastName { get; set; }
        public int? PersonTitleId { get; set; }
        public string PersonSocialSecurityNo { get; set; }
        public string PersonPassportNo { get; set; }
        [Required(ErrorMessage = "Gender is required.")]
        public int PersonSexId { get; set; }
        [Required(ErrorMessage = "Marital status is required.")]
        public int PersonMaritalStatus { get; set; }
        public bool? VIPPatient { get; set; }
        public string? Practice { get; set; }
        public int? PersonEthnicityTypeId { get; set; }
        [Required(ErrorMessage = "Date of Birth must be entered.")]
        public DateTime? PatientBirthDate { get; set; }
        public string PersonDriversLicenseNo { get; set; }
        public int? PatientBloodGroupId { get; set; }
        public byte[]? PatientPicture { get; set; }
        public long? GenderIdentity { get; set; }
        public string ResidenceVisaNo { get; set; }
        public string LaborCardNo { get; set; }
        public int? Religion { get; set; }
        public int? PrimaryLanguage { get; set; }
        [Required(ErrorMessage = "Nationality is required.")]
        public int? Nationality { get; set; }
        public string? EMPI { get; set; }
        public string? UpdatedBy { get; set; }
        public long? MediaChannelId { get; set; }
        public long? MediaItemId { get; set; }
        public string EmiratesIDN { get; set; }
        public string? PersonNameArabic { get; set; }
        public int? TabsTypeId { get; set; }
        public string BillingNote { get; set; }
        public bool? AdvDirective { get; set; }
        public bool? Pregnant { get; set; }
        public bool? DrugHistConsent { get; set; }
        public bool? ExemptReporting { get; set; }
        public DateTime? DateofDeath { get; set; }
        public string CauseofDeath { get; set; }
        public string PreferredName { get; set; }
        public string PrimarycarephysicianPcp { get; set; }
        public int? erelationshipId { get; set; }
        public List<RegPatientEmployer>? regPatientEmployer { get; set; }
        public List<RegAccount>? regAccount { get; set; }
        // public List<RegPatientDetails>? regPatientDetails { get; set; }
        public Contact? Contact { get; set; }
        public Employment? Employment { get; set; }
        public EmergencyContact? EmergencyContact { get; set; }
        public NextOfKin? NextOfKin { get; set; }
        public Spouse? Spouse { get; set; }
        public Parent? Parent { get; set; }
        public Assignments? Assignments { get; set; }
        public FamilyMembers? FamilyMembers { get; set; }
    }





    public class RegInsertModel_new
    {
        public long? PatientId { get; set; }
        [Required(ErrorMessage = "First Name is required.")]
        public string PersonFirstName { get; set; }
        public string PersonMiddleName { get; set; }
        [Required(ErrorMessage = "Last Name is required.")]
        public string PersonLastName { get; set; }
        public int? PersonTitleId { get; set; }
        public string PersonSocialSecurityNo { get; set; }
        public string PersonPassportNo { get; set; }
        [Required(ErrorMessage = "Gender is required.")]
        public int PersonSexId { get; set; }
        [Required(ErrorMessage = "Marital status is required.")]
        public int PersonMaritalStatus { get; set; }
        public bool? VIPPatient { get; set; }
        public string? Practice { get; set; }
        public int? PersonEthnicityTypeId { get; set; }
        [Required(ErrorMessage = "Date of Birth must be entered.")]
        public DateTime? PatientBirthDate { get; set; }
        public string PersonDriversLicenseNo { get; set; }
        public int? PatientBloodGroupId { get; set; }
        public byte[]? PatientPicture { get; set; }
        public long? GenderIdentity { get; set; }
        public string ResidenceVisaNo { get; set; }
        public string LaborCardNo { get; set; }
        public int? Religion { get; set; }
        public int? PrimaryLanguage { get; set; }
        [Required(ErrorMessage = "Nationality is required.")]
        public int? Nationality { get; set; }
        public string? EMPI { get; set; }
        public string? UpdatedBy { get; set; }
        public long? MediaChannelId { get; set; }
        public long? MediaItemId { get; set; }
        public string EmiratesIDN { get; set; }
        public string? PersonNameArabic { get; set; }
        public int? TabsTypeId { get; set; }
        public string BillingNote { get; set; }
        public bool? AdvDirective { get; set; }
        public bool? Pregnant { get; set; }
        public bool? DrugHistConsent { get; set; }
        public bool? ExemptReporting { get; set; }
        public DateTime? DateofDeath { get; set; }
        public string CauseofDeath { get; set; }
        public string PreferredName { get; set; }
        public string PrimarycarephysicianPcp { get; set; }
        public int? erelationshipId { get; set; }
    }

}