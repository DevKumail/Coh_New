using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("BLPayer")]
    public partial class Blpayer
    {
        public Blpayer()
        {
            BlpatientVisits = new HashSet<BlpatientVisit>();
            BlpayerPackages = new HashSet<BlpayerPackage>();
            BlpayerPlans = new HashSet<BlpayerPlan>();
            BlprocedureGroupCodes = new HashSet<BlprocedureGroupCode>();
            EligibilityLogs = new HashSet<EligibilityLog>();
            InsuranceEligibilities = new HashSet<InsuranceEligibility>();
            InsuredSubscribers = new HashSet<InsuredSubscriber>();
            Insureds = new HashSet<Insured>();
            SchAppointments = new HashSet<SchAppointment>();
        }

        [Key]
        public long PayerId { get; set; }
        [Required]
        [StringLength(200)]
        [Unicode(false)]
        public string PayerName { get; set; }
        [StringLength(55)]
        [Unicode(false)]
        public string Address1 { get; set; }
        [StringLength(55)]
        [Unicode(false)]
        public string Address2 { get; set; }
        [StringLength(20)]
        [Unicode(false)]
        public string Phone1 { get; set; }
        [Column("ID")]
        [StringLength(10)]
        [Unicode(false)]
        public string Id { get; set; }
        [StringLength(20)]
        [Unicode(false)]
        public string Type { get; set; }
        [StringLength(55)]
        [Unicode(false)]
        public string Model { get; set; }
        [Column("LOB")]
        [StringLength(50)]
        [Unicode(false)]
        public string Lob { get; set; }
        [StringLength(10)]
        [Unicode(false)]
        public string Card { get; set; }
        [StringLength(10)]
        [Unicode(false)]
        public string Enroll { get; set; }
        [StringLength(10)]
        [Unicode(false)]
        public string ReEnroll { get; set; }
        [Column("TPO")]
        [StringLength(50)]
        [Unicode(false)]
        public string Tpo { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string Service { get; set; }
        public bool? Active { get; set; }
        [StringLength(2)]
        [Unicode(false)]
        public string ClaimFillingIndicatorCode { get; set; }
        [StringLength(2)]
        [Unicode(false)]
        public string Qualifier { get; set; }
        [StringLength(1)]
        [Unicode(false)]
        public string ClaimMode { get; set; }
        [Column("EIID")]
        [StringLength(5)]
        [Unicode(false)]
        public string Eiid { get; set; }
        [StringLength(1000)]
        [Unicode(false)]
        public string Disclaimer270 { get; set; }
        [Column("EIQualifier")]
        [StringLength(2)]
        [Unicode(false)]
        public string Eiqualifier { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string Email { get; set; }
        [StringLength(15)]
        [Unicode(false)]
        public string Fax { get; set; }
        [Column(TypeName = "decimal(18, 0)")]
        public decimal? Discount { get; set; }
        [Column("PayerCategoryID")]
        public int? PayerCategoryId { get; set; }
        public bool? DeductibleAfterDiscount { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string ClaimLicenseNumberPaper { get; set; }
        public bool? IsHospital { get; set; }
        [Column("splitBill")]
        public bool? SplitBill { get; set; }
        [Column("TRN")]
        [StringLength(50)]
        [Unicode(false)]
        public string Trn { get; set; }
        [Column("AXCustomer")]
        [StringLength(55)]
        [Unicode(false)]
        public string Axcustomer { get; set; }
        [Column("DHA_Code")]
        [StringLength(15)]
        [Unicode(false)]
        public string DhaCode { get; set; }
        [Column("IsELEnabled")]
        public bool IsElenabled { get; set; }
        public bool? IsDeleted { get; set; }
        public int? PayerCodeforEligibilityInformation { get; set; }

        [InverseProperty("Payer")]
        public virtual ICollection<BlpatientVisit> BlpatientVisits { get; set; }
        [InverseProperty("Payer")]
        public virtual ICollection<BlpayerPackage> BlpayerPackages { get; set; }
        [InverseProperty("Payer")]
        public virtual ICollection<BlpayerPlan> BlpayerPlans { get; set; }
        [InverseProperty("Payer")]
        public virtual ICollection<BlprocedureGroupCode> BlprocedureGroupCodes { get; set; }
        [InverseProperty("Payer")]
        public virtual ICollection<EligibilityLog> EligibilityLogs { get; set; }
        [InverseProperty("BlPayer")]
        public virtual ICollection<InsuranceEligibility> InsuranceEligibilities { get; set; }
        [InverseProperty("Carrier")]
        public virtual ICollection<InsuredSubscriber> InsuredSubscribers { get; set; }
        [InverseProperty("Carrier")]
        public virtual ICollection<Insured> Insureds { get; set; }
        [InverseProperty("Payer")]
        public virtual ICollection<SchAppointment> SchAppointments { get; set; }
    }
}
