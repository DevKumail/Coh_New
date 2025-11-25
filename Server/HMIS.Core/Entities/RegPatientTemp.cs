using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class RegPatientTemp
{
    [Key]
    public long TempId { get; set; }

    public byte? PersonTitleId { get; set; }

    public int? PersonNationalityId { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? PersonFullName { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string? PersonSex { get; set; }

    public int? PersonAge { get; set; }

    [StringLength(15)]
    [Unicode(false)]
    public string? PersonCellPhone { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? PersonAddress1 { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? PersonAddress2 { get; set; }

    public int? PersonCountryId { get; set; }

    public int? PersonStateId { get; set; }

    public int? PersonCityId { get; set; }

    [StringLength(15)]
    [Unicode(false)]
    public string? PersonZipCode { get; set; }

    [StringLength(15)]
    [Unicode(false)]
    public string? PersonHomePhone1 { get; set; }

    [StringLength(15)]
    [Unicode(false)]
    public string? PersonWorkPhone1 { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? PersonEmail { get; set; }

    [Column("NOKFullName")]
    [StringLength(255)]
    [Unicode(false)]
    public string? NokfullName { get; set; }

    [Column("NOKRelationshipId")]
    public byte? NokrelationshipId { get; set; }

    [Column("NOKHomePhone")]
    [StringLength(15)]
    [Unicode(false)]
    public string? NokhomePhone { get; set; }

    [Column("NOKWorkPhone")]
    [StringLength(15)]
    [Unicode(false)]
    public string? NokworkPhone { get; set; }

    [Column("NOKCellNo")]
    [StringLength(15)]
    [Unicode(false)]
    public string? NokcellNo { get; set; }

    [Column("NOKSocialSecurityNo")]
    [StringLength(20)]
    [Unicode(false)]
    public string? NoksocialSecurityNo { get; set; }

    [Column("NOKAddress1")]
    [StringLength(50)]
    [Unicode(false)]
    public string? Nokaddress1 { get; set; }

    [Column("NOKAddress2")]
    [StringLength(50)]
    [Unicode(false)]
    public string? Nokaddress2 { get; set; }

    [Column("NOKCountryId")]
    public int? NokcountryId { get; set; }

    [Column("NOKStateId")]
    public int? NokstateId { get; set; }

    [Column("NOKCityId")]
    public int? NokcityId { get; set; }

    [Column("NOKZipCode")]
    [StringLength(15)]
    [Unicode(false)]
    public string? NokzipCode { get; set; }

    [StringLength(2500)]
    public string? Comments { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedOn { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? UpdatedBy { get; set; }

    public bool? Active { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? PatientBirthDate { get; set; }

    public bool? IsDeleted { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? StreetNumber { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? DwellingNumber { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [ForeignKey("NokcityId")]
    [InverseProperty("RegPatientTempNokcity")]
    public virtual RegCities? Nokcity { get; set; }

    [ForeignKey("NokcountryId")]
    [InverseProperty("RegPatientTempNokcountry")]
    public virtual RegCountries? Nokcountry { get; set; }

    [ForeignKey("NokstateId")]
    [InverseProperty("RegPatientTempNokstate")]
    public virtual RegStates? Nokstate { get; set; }

    [ForeignKey("PersonCityId")]
    [InverseProperty("RegPatientTempPersonCity")]
    public virtual RegCities? PersonCity { get; set; }

    [ForeignKey("PersonCountryId")]
    [InverseProperty("RegPatientTempPersonCountry")]
    public virtual RegCountries? PersonCountry { get; set; }

    [ForeignKey("PersonNationalityId")]
    [InverseProperty("RegPatientTemp")]
    public virtual Nationality? PersonNationality { get; set; }

    [ForeignKey("PersonStateId")]
    [InverseProperty("RegPatientTempPersonState")]
    public virtual RegStates? PersonState { get; set; }

    [ForeignKey("PersonTitleId")]
    [InverseProperty("RegPatientTemp")]
    public virtual RegTitle? PersonTitle { get; set; }
}
