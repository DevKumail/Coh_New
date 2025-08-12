using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.ControlPanel
{
    public class Hremployee
    {
        public long EmployeeId { get; set; }
        public int? EmployeeType { get; set; }

        public bool Active { get; set; }
        public string? Prefix { get; set; }
        public string? FullName { get; set; }
        public string? ArFullName { get; set; }
        public bool? IsEmployee { get; set; }
        public string? Credential { get; set; }
        public string? Nic { get; set; }
        public int? CityID { get; set; }
        public int? CountryID { get; set; }
        public string? StateID { get; set; }
        public string? ZipCode { get; set; }
        public string? CellNo { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Fax { get; set; }
        public string? DriversLicenseNo { get; set; }
        public DateTime? DOB { get; set; }
        public string? Gender { get; set; }
        public string? BloodGroup { get; set; }
        public string? MaritalStatus { get; set; }

        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string? HomeAddress1 { get; set; }
        public string? HomeAddress2 { get; set; }
        public bool? IsAdmin { get; set; }
        public string? HomePager { get; set; }
        public string? EmerRelationship { get; set; }
        public string? EmerFullName { get; set; }
        public string? EmerAddress1 { get; set; }
        public string? EmerAddress2 { get; set; }
        public int? EmerCountryId { get; set; }
        public int? EmerStateId { get; set; }
        public int? EmerCityId { get; set; }
        public string? EmerZipCode { get; set; }
        public string? EmerEmail { get; set; }
        public string? EmerPhone { get; set; }
        public string? EmerCellPhone { get; set; }
        public string? EmerPager { get; set; }
        public string? EmerFax { get; set; }
        public byte[]? UserPicture { get; set; }
        public string? ProvRemAddress2 { get; set; }
        public string? ProvStateLicNo { get; set; }
        public string? ProvDeaNo { get; set; }
        public string? ProvCtrlSubsNo { get; set; }
        public string? ProvUpin { get; set; }
        public string? ProvTaxonomy { get; set; }
        public string? IsPerson { get; set; }
        public bool? IsRefProvider { get; set; }
        public bool? PasswordResetByAdmin { get; set; }
        public DateTime? PasswordUpdatedDate { get; set; }
        public string? ProvNPI { get; set; }
        public string? Initials { get; set; }
        public string? DHCCCode { get; set; }
        public long ProviderSPID { get; set; }
        public bool? VIPPatientAccess { get; set; }
        public DateTime? JoiningDate { get; set; }
        public bool? AllowChgCap { get; set; }
        public string? ErxUserName { get; set; }
        public string? ErxPass { get; set; }
        public string? HaadLicType { get; set; }
        public decimal? DrCashPrice { get; set; }
        public bool? GrantAccessToMalaffi { get; set; }
        public int? MalaffiRoleLevel { get; set; }
        public bool? EnableMBR { get; set; }
        public byte[]? SignatureImage { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? UpdatedBy { get; set; }
        public string? PassPortNo { get; set; }
        public string? BusAddress1 { get; set; }
        public string? BusAddress2 { get; set; }
        public int? BusCountryId { get; set; }
        public int? BusCityId { get; set; }
        public int? BusStateId { get; set; }
        public string? BusZipCode { get; set; }
        public string? BusEmail { get; set; }
        public string? BusPhone { get; set; }
        public string? BusCellPhone { get; set; }
        public string? BusPager { get; set; }
        public string? BusFax { get; set; }
        public string? DwellingNumber { get; set; }
        public string? BusDwellingNumber { get; set; }
        public string? EmerDwellingNumber { get; set; }
        public string? BusEnitity { get; set; }


        public List<HREmployeeFacility>? EmployeeFacility { get; set; }

        public List<SecEmployeeRole>? EmployeeRole { get; set; }

        public List<HrlicenseInfo>? LicenseInfo { get; set; }
    }
}
