using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Index("CreatedDate", Name = "IX_RegPatient_CreatedDate")]
[Index("PatientBirthDate", Name = "IX_RegPatient_PatientBirthDate")]
[Index("PersonFirstName", Name = "IX_RegPatient_PersonFirstName")]
[Index("PersonLastName", Name = "IX_RegPatient_PersonLastName")]
[Index("Mrno", Name = "unique_mrno", IsUnique = true)]
public partial class RegPatient
{
    [Key]
    public long PatientId { get; set; }

    [Column("MRNo")]
    [StringLength(10)]
    [Unicode(false)]
    public string Mrno { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string? PersonMiddleName { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? PersonLastName { get; set; }

    [StringLength(60)]
    [Unicode(false)]
    public string? PersonFirstName { get; set; }

    public byte? PersonTitleId { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? PersonSocialSecurityNo { get; set; }

    [StringLength(15)]
    [Unicode(false)]
    public string? PersonPassportNo { get; set; }

    public int? PersonMaritalStatus { get; set; }

    public int? PersonEthnicityTypeId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? PatientBirthDate { get; set; }

    [StringLength(15)]
    [Unicode(false)]
    public string? PersonDriversLicenseNo { get; set; }

    public int? PatientBloodGroupId { get; set; }

    public byte[]? PatientPicture { get; set; }

    public bool Inactive { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    [StringLength(18)]
    [Unicode(false)]
    public string? ResidenceVisaNo { get; set; }

    [StringLength(18)]
    [Unicode(false)]
    public string? LaborCardNo { get; set; }

    public int? Religion { get; set; }

    public int? PrimaryLanguage { get; set; }

    public int? Nationality { get; set; }

    [Column("EMPI")]
    [StringLength(20)]
    [Unicode(false)]
    public string? Empi { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    [Column("MediaChannelID")]
    public long? MediaChannelId { get; set; }

    [Column("MediaItemID")]
    public long? MediaItemId { get; set; }

    [Column("VIPPatient")]
    public bool? Vippatient { get; set; }

    public long? TempId { get; set; }

    [Column("EmiratesIDN")]
    [StringLength(50)]
    [Unicode(false)]
    public string? EmiratesIdn { get; set; }

    [StringLength(50)]
    public string? PersonNameArabic { get; set; }

    public int? TabsTypeId { get; set; }

    public int? PersonSex { get; set; }

    public bool? IsDeleted { get; set; }

    public long? GenderIdentity { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Practice { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? BillingNote { get; set; }

    public bool? AdvDirective { get; set; }

    public bool? Pregnant { get; set; }

    public bool? DrugHistConsent { get; set; }

    public bool? ExemptReporting { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DateofDeath { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? CauseofDeath { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? PreferredName { get; set; }

    [Column("PrimarycarephysicianPCP")]
    [StringLength(50)]
    [Unicode(false)]
    public string? PrimarycarephysicianPcp { get; set; }

    [InverseProperty("Patient")]
    public virtual ICollection<EligibilityLog> EligibilityLog { get; set; } = new List<EligibilityLog>();

    [InverseProperty("Patient")]
    public virtual ICollection<Insured> Insured { get; set; } = new List<Insured>();

    [ForeignKey("PatientBloodGroupId")]
    [InverseProperty("RegPatient")]
    public virtual RegBloodGroup? PatientBloodGroup { get; set; }

    [InverseProperty("Patient")]
    public virtual ICollection<PatientProblem> PatientProblem { get; set; } = new List<PatientProblem>();

    [InverseProperty("Patient")]
    public virtual ICollection<RegAccount> RegAccount { get; set; } = new List<RegAccount>();

    [InverseProperty("Patient")]
    public virtual ICollection<RegPatientDetails> RegPatientDetails { get; set; } = new List<RegPatientDetails>();

    [InverseProperty("Patient")]
    public virtual ICollection<RegPatientEmployer> RegPatientEmployer { get; set; } = new List<RegPatientEmployer>();

    [InverseProperty("Patient")]
    public virtual ICollection<SchAppointment> SchAppointment { get; set; } = new List<SchAppointment>();

    [InverseProperty("Patient")]
    public virtual ICollection<SpeechToText> SpeechToText { get; set; } = new List<SpeechToText>();

    [ForeignKey("TabsTypeId")]
    [InverseProperty("RegPatient")]
    public virtual RegPatientTabsType? TabsType { get; set; }
}
