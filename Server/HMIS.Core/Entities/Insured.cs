using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("Insured")]
[Index("PatientId", Name = "IX_Insured_PatientId")]
public partial class Insured
{
    [Key]
    public long InsuredId { get; set; }

    public long SubscriberId { get; set; }

    public long? CarrierId { get; set; }

    [Column("InsuredIDNo")]
    [StringLength(80)]
    [Unicode(false)]
    public string InsuredIdno { get; set; } = null!;

    [StringLength(2)]
    [Unicode(false)]
    public string? InsuranceTypeCode { get; set; }

    [StringLength(2)]
    [Unicode(false)]
    public string? ClaimFillingIndicatorCode { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string? InsuredGroupOrPolicyNo { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? InsuredGroupOrPolicyName { get; set; }

    public byte CompanyOrIndividual { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? EffectiveDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? TerminationDate { get; set; }

    [Column(TypeName = "money")]
    public decimal? Copay { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string? Suffix { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? FirstName { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? MiddleName { get; set; }

    [StringLength(35)]
    [Unicode(false)]
    public string LastName { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime? BirthDate { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string Sex { get; set; } = null!;

    [StringLength(10)]
    [Unicode(false)]
    public string? Weight { get; set; }

    [StringLength(15)]
    [Unicode(false)]
    public string InsuredPhone { get; set; } = null!;

    [StringLength(15)]
    [Unicode(false)]
    public string? OtherPhone { get; set; }

    [Column("SSN")]
    [StringLength(12)]
    [Unicode(false)]
    public string? Ssn { get; set; }

    [StringLength(35)]
    [Unicode(false)]
    public string? EmployerOrSchoolName { get; set; }

    [StringLength(55)]
    [Unicode(false)]
    public string Address1 { get; set; } = null!;

    [StringLength(55)]
    [Unicode(false)]
    public string? Address2 { get; set; }

    [StringLength(15)]
    [Unicode(false)]
    public string ZipCode { get; set; } = null!;

    public int CityId { get; set; }

    public int StateId { get; set; }

    public int CountryId { get; set; }

    public bool? Inactive { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string EnteredBy { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime EntryDate { get; set; }

    public bool Verified { get; set; }

    [Column(TypeName = "money")]
    public decimal? Deductibles { get; set; }

    public bool? ChkDeductibles { get; set; }

    [Column("DNDeductible", TypeName = "money")]
    public decimal? Dndeductible { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string? OldInsuredGroupOrPolicyNo { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? OldInsuredGroupOrPolicyName { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string? OldPlanInActiveDate { get; set; }

    [Column("OPCopay", TypeName = "money")]
    public decimal? Opcopay { get; set; }

    public long? PayerPackageId { get; set; }

    [StringLength(2)]
    [Unicode(false)]
    public string RelationCode { get; set; } = null!;

    public byte CoverageOrder { get; set; }

    public bool? IsSelected { get; set; }

    [Column("oldMRNo")]
    [StringLength(20)]
    [Unicode(false)]
    public string? OldMrno { get; set; }

    public long? PatientId { get; set; }

    public bool? IsDeleted { get; set; }

    [ForeignKey("CarrierId")]
    [InverseProperty("Insureds")]
    public virtual Blpayer? Carrier { get; set; }

    [ForeignKey("PatientId")]
    [InverseProperty("Insureds")]
    public virtual RegPatient? Patient { get; set; }

    [ForeignKey("PayerPackageId")]
    [InverseProperty("Insureds")]
    public virtual BlpayerPackage? PayerPackage { get; set; }
}
