using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class InsuredSubscriber
{
    [Key]
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

    [Column("MRNo")]
    [StringLength(10)]
    [Unicode(false)]
    public string? Mrno { get; set; }

    public byte? CoverageOrder { get; set; }

    public bool? IsSelected { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [InverseProperty("Subscriber")]
    public virtual ICollection<BlpatientVisit> BlpatientVisit { get; set; } = new List<BlpatientVisit>();

    [ForeignKey("CarrierId")]
    [InverseProperty("InsuredSubscriber")]
    public virtual Blpayer? Carrier { get; set; }

    [ForeignKey("CityId")]
    [InverseProperty("InsuredSubscriber")]
    public virtual RegCities City { get; set; } = null!;

    [ForeignKey("CountryId")]
    [InverseProperty("InsuredSubscriber")]
    public virtual RegCountries Country { get; set; } = null!;

    [InverseProperty("Subscriber")]
    public virtual ICollection<DeductiblePercent> DeductiblePercent { get; set; } = new List<DeductiblePercent>();

    [InverseProperty("Subscriber")]
    public virtual ICollection<InsuredPolicy> InsuredPolicy { get; set; } = new List<InsuredPolicy>();

    [ForeignKey("PayerPackageId")]
    [InverseProperty("InsuredSubscriber")]
    public virtual BlpayerPackage? PayerPackage { get; set; }

    [InverseProperty("Subscriber")]
    public virtual ICollection<SchAppointment> SchAppointment { get; set; } = new List<SchAppointment>();

    [ForeignKey("StateId")]
    [InverseProperty("InsuredSubscriber")]
    public virtual RegStates State { get; set; } = null!;
}
