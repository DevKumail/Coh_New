﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("HREmployee")]
    public partial class Hremployee
    {
        public Hremployee()
        {
            BlmasterProcedureCreatedByNavigations = new HashSet<BlmasterProcedure>();
            BlmasterProcedureUpdatedByNavigations = new HashSet<BlmasterProcedure>();
            EligibilityLogs = new HashSet<EligibilityLog>();
            HremployeeFacilities = new HashSet<HremployeeFacility>();
            HrlicenseInfos = new HashSet<HrlicenseInfo>();
            PatientAllergyCreatedByNavigations = new HashSet<PatientAllergy>();
            PatientAllergyProviders = new HashSet<PatientAllergy>();
            PatientAllergyUpdatedByNavigations = new HashSet<PatientAllergy>();
            PatientImmunizationCreatedByNavigations = new HashSet<PatientImmunization>();
            PatientImmunizationProviders = new HashSet<PatientImmunization>();
            PatientImmunizationUpdatedByNavigations = new HashSet<PatientImmunization>();
            PatientProcedureCreatedByNavigations = new HashSet<PatientProcedure>();
            PatientProcedureUpdatedByNavigations = new HashSet<PatientProcedure>();
            Prescriptions = new HashSet<Prescription>();
            RegCompanies = new HashSet<RegCompany>();
            RegPatientDetails = new HashSet<RegPatientDetail>();
            SchAppointments = new HashSet<SchAppointment>();
            SecEmployeeRoles = new HashSet<SecEmployeeRole>();
        }

        [Key]
        public long EmployeeId { get; set; }
        public int? EmployeeType { get; set; }
        [StringLength(10)]
        [Unicode(false)]
        public string Prefix { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string FullName { get; set; }
        [StringLength(50)]
        public string ArFullName { get; set; }
        public bool? IsEmployee { get; set; }
        [StringLength(10)]
        [Unicode(false)]
        public string Credential { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string Nic { get; set; }
        [Column("CityID")]
        public int? CityId { get; set; }
        [Column("CountryID")]
        public int? CountryId { get; set; }
        [Column("StateID")]
        [StringLength(25)]
        [Unicode(false)]
        public string StateId { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string DwellingNumber { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string ZipCode { get; set; }
        [StringLength(20)]
        [Unicode(false)]
        public string CellNo { get; set; }
        [StringLength(20)]
        [Unicode(false)]
        public string Phone { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string Email { get; set; }
        [StringLength(15)]
        [Unicode(false)]
        public string Fax { get; set; }
        [StringLength(15)]
        [Unicode(false)]
        public string DriversLicenseNo { get; set; }
        [Column("DOB", TypeName = "datetime")]
        public DateTime? Dob { get; set; }
        [StringLength(10)]
        [Unicode(false)]
        public string Gender { get; set; }
        [StringLength(11)]
        [Unicode(false)]
        public string BloodGroup { get; set; }
        [StringLength(20)]
        [Unicode(false)]
        public string MaritalStatus { get; set; }
        public bool Active { get; set; }
        [StringLength(25)]
        [Unicode(false)]
        public string UserName { get; set; }
        [StringLength(100)]
        [Unicode(false)]
        public string Password { get; set; }
        [StringLength(55)]
        [Unicode(false)]
        public string HomeAddress1 { get; set; }
        [StringLength(55)]
        [Unicode(false)]
        public string HomeAddress2 { get; set; }
        public bool? IsAdmin { get; set; }
        [StringLength(20)]
        [Unicode(false)]
        public string HomePager { get; set; }
        [StringLength(30)]
        [Unicode(false)]
        public string EmerRelationship { get; set; }
        [StringLength(25)]
        [Unicode(false)]
        public string EmerFullName { get; set; }
        [StringLength(55)]
        [Unicode(false)]
        public string EmerAddress1 { get; set; }
        [StringLength(55)]
        [Unicode(false)]
        public string EmerAddress2 { get; set; }
        public int? EmerCountryId { get; set; }
        public int? EmerStateId { get; set; }
        public int? EmerCityId { get; set; }
        [StringLength(15)]
        [Unicode(false)]
        public string EmerZipCode { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string EmerEmail { get; set; }
        [StringLength(15)]
        [Unicode(false)]
        public string EmerPhone { get; set; }
        [StringLength(15)]
        [Unicode(false)]
        public string EmerCellPhone { get; set; }
        [StringLength(15)]
        [Unicode(false)]
        public string EmerPager { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string EmerDwellingNumber { get; set; }
        [StringLength(15)]
        [Unicode(false)]
        public string EmerFax { get; set; }
        [Column(TypeName = "image")]
        public byte[] UserPicture { get; set; }
        [StringLength(55)]
        [Unicode(false)]
        public string ProvRemAddress2 { get; set; }
        [StringLength(10)]
        [Unicode(false)]
        public string ProvStateLicNo { get; set; }
        [StringLength(12)]
        [Unicode(false)]
        public string ProvDeaNo { get; set; }
        [StringLength(12)]
        [Unicode(false)]
        public string ProvCtrlSubsNo { get; set; }
        [StringLength(12)]
        [Unicode(false)]
        public string ProvUpin { get; set; }
        [StringLength(12)]
        [Unicode(false)]
        public string ProvTaxonomy { get; set; }
        [StringLength(1)]
        [Unicode(false)]
        public string IsPerson { get; set; }
        public bool? IsRefProvider { get; set; }
        public bool? PasswordResetByAdmin { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? PasswordUpdatedDate { get; set; }
        [Column("ProvNPI")]
        [StringLength(25)]
        [Unicode(false)]
        public string ProvNpi { get; set; }
        [StringLength(5)]
        [Unicode(false)]
        public string Initials { get; set; }
        [Column("DHCCCode")]
        [StringLength(25)]
        [Unicode(false)]
        public string Dhcccode { get; set; }
        [Column("ProviderSPID")]
        public long? ProviderSpid { get; set; }
        [Column("VIPPatientAccess")]
        public bool? VippatientAccess { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? JoiningDate { get; set; }
        public bool? AllowChgCap { get; set; }
        [StringLength(100)]
        [Unicode(false)]
        public string ErxUserName { get; set; }
        [StringLength(100)]
        public string ErxPass { get; set; }
        [StringLength(3)]
        [Unicode(false)]
        public string HaadLicType { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal? DrCashPrice { get; set; }
        public bool? GrantAccessToMalaffi { get; set; }
        public byte? MalaffiRoleLevel { get; set; }
        [Column("EnableMBR")]
        public bool? EnableMbr { get; set; }
        [Column(TypeName = "image")]
        public byte[] SignatureImage { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedOn { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string UpdatedBy { get; set; }
        [StringLength(255)]
        [Unicode(false)]
        public string PassPortNo { get; set; }
        [StringLength(55)]
        [Unicode(false)]
        public string BusAddress1 { get; set; }
        [StringLength(55)]
        [Unicode(false)]
        public string BusAddress2 { get; set; }
        public int? BusCountryId { get; set; }
        public int? BusCityId { get; set; }
        public int? BusStateId { get; set; }
        [StringLength(15)]
        [Unicode(false)]
        public string BusZipCode { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string BusEmail { get; set; }
        [StringLength(15)]
        [Unicode(false)]
        public string BusPhone { get; set; }
        [StringLength(15)]
        [Unicode(false)]
        public string BusCellPhone { get; set; }
        [StringLength(15)]
        [Unicode(false)]
        public string BusPager { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string BusDwellingNumber { get; set; }
        [StringLength(15)]
        [Unicode(false)]
        public string BusFax { get; set; }
        public bool? IsDeleted { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string BusEnitity { get; set; }

        [InverseProperty("CreatedByNavigation")]
        public virtual ICollection<BlmasterProcedure> BlmasterProcedureCreatedByNavigations { get; set; }
        [InverseProperty("UpdatedByNavigation")]
        public virtual ICollection<BlmasterProcedure> BlmasterProcedureUpdatedByNavigations { get; set; }
        [InverseProperty("Requestedby")]
        public virtual ICollection<EligibilityLog> EligibilityLogs { get; set; }
        [InverseProperty("Employee")]
        public virtual ICollection<HremployeeFacility> HremployeeFacilities { get; set; }
        [InverseProperty("Employee")]
        public virtual ICollection<HrlicenseInfo> HrlicenseInfos { get; set; }
        [InverseProperty("CreatedByNavigation")]
        public virtual ICollection<PatientAllergy> PatientAllergyCreatedByNavigations { get; set; }
        [InverseProperty("Provider")]
        public virtual ICollection<PatientAllergy> PatientAllergyProviders { get; set; }
        [InverseProperty("UpdatedByNavigation")]
        public virtual ICollection<PatientAllergy> PatientAllergyUpdatedByNavigations { get; set; }
        [InverseProperty("CreatedByNavigation")]
        public virtual ICollection<PatientImmunization> PatientImmunizationCreatedByNavigations { get; set; }
        [InverseProperty("Provider")]
        public virtual ICollection<PatientImmunization> PatientImmunizationProviders { get; set; }
        [InverseProperty("UpdatedByNavigation")]
        public virtual ICollection<PatientImmunization> PatientImmunizationUpdatedByNavigations { get; set; }
        [InverseProperty("CreatedByNavigation")]
        public virtual ICollection<PatientProcedure> PatientProcedureCreatedByNavigations { get; set; }
        [InverseProperty("UpdatedByNavigation")]
        public virtual ICollection<PatientProcedure> PatientProcedureUpdatedByNavigations { get; set; }
        [InverseProperty("Provider")]
        public virtual ICollection<Prescription> Prescriptions { get; set; }
        [InverseProperty("CreatedBy")]
        public virtual ICollection<RegCompany> RegCompanies { get; set; }
        [InverseProperty("Provider")]
        public virtual ICollection<RegPatientDetail> RegPatientDetails { get; set; }
        [InverseProperty("Employee")]
        public virtual ICollection<SchAppointment> SchAppointments { get; set; }
        [InverseProperty("Employee")]
        public virtual ICollection<SecEmployeeRole> SecEmployeeRoles { get; set; }
    }
}
