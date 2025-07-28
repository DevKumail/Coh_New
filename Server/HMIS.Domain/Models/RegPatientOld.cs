using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Keyless]
    [Table("RegPatientOld")]
    public partial class RegPatientOld
    {
        [Required]
        [Column("MRNo")]
        [StringLength(10)]
        [Unicode(false)]
        public string Mrno { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string PersonMiddleName { get; set; }
        [StringLength(100)]
        [Unicode(false)]
        public string PersonLastName { get; set; }
        [StringLength(60)]
        [Unicode(false)]
        public string PersonFirstName { get; set; }
        public int? PersonTitleId { get; set; }
        [StringLength(20)]
        [Unicode(false)]
        public string PersonSocialSecurityNo { get; set; }
        [StringLength(15)]
        [Unicode(false)]
        public string PersonPassportNo { get; set; }
        public int? PersonSex { get; set; }
        public int? PersonMaritalStatus { get; set; }
        public int? PersonEthnicityTypeId { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? PatientBirthDate { get; set; }
        [StringLength(15)]
        [Unicode(false)]
        public string PersonDriversLicenseNo { get; set; }
        public int? PatientBloodGroupId { get; set; }
        [Column(TypeName = "image")]
        public byte[] PatientPicture { get; set; }
        public bool Inactive { get; set; }
        [StringLength(25)]
        [Unicode(false)]
        public string UpdatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedDate { get; set; }
        [StringLength(18)]
        [Unicode(false)]
        public string ResidenceVisaNo { get; set; }
        [StringLength(18)]
        [Unicode(false)]
        public string LaborCardNo { get; set; }
        public int? Religion { get; set; }
        public int? PrimaryLanguage { get; set; }
        public int? Nationality { get; set; }
        [Column("EMPI")]
        [StringLength(20)]
        [Unicode(false)]
        public string Empi { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedDate { get; set; }
        [Column("MediaChannelID")]
        public long? MediaChannelId { get; set; }
        [Column("MediaItemID")]
        public long? MediaItemId { get; set; }
        [Column("VIPPatient")]
        public bool? Vippatient { get; set; }
        [Column("EmiratesIDN")]
        [StringLength(50)]
        [Unicode(false)]
        public string EmiratesIdn { get; set; }
        [StringLength(50)]
        public string PersonNameArabic { get; set; }
        public int? TabsTypeId { get; set; }
        public long? PatientId { get; set; }
        public bool? IsDeleted { get; set; }

        [ForeignKey("PatientId")]
        public virtual RegPatient Patient { get; set; }
        [ForeignKey("PatientBloodGroupId")]
        public virtual RegBloodGroup PatientBloodGroup { get; set; }
        [ForeignKey("TabsTypeId")]
        public virtual RegPatientTabsType TabsType { get; set; }
    }
}
