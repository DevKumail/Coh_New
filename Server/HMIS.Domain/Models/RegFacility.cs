using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("RegFacility")]
    public partial class RegFacility
    {
        public RegFacility()
        {
            EligibilityLogs = new HashSet<EligibilityLog>();
            HremployeeFacilities = new HashSet<HremployeeFacility>();
            ProviderSchedules = new HashSet<ProviderSchedule>();
            RegLocationTypes = new HashSet<RegLocationType>();
            SchAppointments = new HashSet<SchAppointment>();
        }

        [Key]
        [Column("ID")]
        public int Id { get; set; }
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        [StringLength(200)]
        public string Description { get; set; }
        [StringLength(50)]
        public string ClaimLicenseNumber { get; set; }
        [StringLength(50)]
        public string Code { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string ClaimLicenseNumberPaper { get; set; }
        [StringLength(20)]
        [Unicode(false)]
        public string LoginRegCode { get; set; }
        [StringLength(100)]
        public string FacilityNameArabic { get; set; }
        [Column("IVFEnabled")]
        public bool? Ivfenabled { get; set; }
        [Column("HL7Enabled")]
        public bool? Hl7enabled { get; set; }
        [StringLength(10)]
        [Unicode(false)]
        public string LabReferenceNoPrefix { get; set; }
        [Column("GeoMapURL")]
        [StringLength(500)]
        [Unicode(false)]
        public string GeoMapUrl { get; set; }
        [StringLength(15)]
        [Unicode(false)]
        public string Phone1 { get; set; }
        public bool? IsFertilityCenter { get; set; }
        [Column("BillToFacilityID")]
        public int? BillToFacilityId { get; set; }
        [Column("VATRegNo")]
        [StringLength(50)]
        [Unicode(false)]
        public string VatregNo { get; set; }
        [StringLength(50)]
        public string EclaimFacilityPassword { get; set; }
        public int? CityId { get; set; }
        [Column("eRxEnabled")]
        public bool? ERxEnabled { get; set; }
        [Column("StateID")]
        public int? StateId { get; set; }
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
        public bool? IsDeleted { get; set; }
        public int? FacilityCodeforEligibilityInformation { get; set; }
        public long? CompanyId { get; set; }

        [ForeignKey("CompanyId")]
        [InverseProperty("RegFacilities")]
        public virtual RegCompany Company { get; set; }
        [InverseProperty("Facility")]
        public virtual ICollection<EligibilityLog> EligibilityLogs { get; set; }
        [InverseProperty("Facility")]
        public virtual ICollection<HremployeeFacility> HremployeeFacilities { get; set; }
        [InverseProperty("Facility")]
        public virtual ICollection<ProviderSchedule> ProviderSchedules { get; set; }
        [InverseProperty("Facility")]
        public virtual ICollection<RegLocationType> RegLocationTypes { get; set; }
        [InverseProperty("Facility")]
        public virtual ICollection<SchAppointment> SchAppointments { get; set; }
    }
}
