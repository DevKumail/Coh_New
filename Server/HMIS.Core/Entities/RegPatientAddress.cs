using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class RegPatientAddress
{
    [Key]
    [Column("ID")]
    public long Id { get; set; }

    [Column("ContactRStreetName")]
    public string? ContactRstreetName { get; set; }

    [Column("ContactRDwellingNumber")]
    [StringLength(50)]
    public string? ContactRdwellingNumber { get; set; }

    [Column("ContactRCountryId")]
    public long? ContactRcountryId { get; set; }

    [Column("ContactRStateId")]
    public long? ContactRstateId { get; set; }

    [Column("ContactRCityId")]
    public long? ContactRcityId { get; set; }

    [Column("ContactRPostalCode")]
    [StringLength(50)]
    public string? ContactRpostalCode { get; set; }

    [Column("ContactRHomePhone")]
    [StringLength(50)]
    public string? ContactRhomePhone { get; set; }

    [Column("ContactRWorkPhone")]
    [StringLength(50)]
    public string? ContactRworkPhone { get; set; }

    [Column("ContactRFax")]
    [StringLength(50)]
    public string? ContactRfax { get; set; }

    [Column("ContactRCellPhone")]
    [StringLength(50)]
    public string? ContactRcellPhone { get; set; }

    [Column("ContactREmail")]
    [StringLength(50)]
    public string? ContactRemail { get; set; }

    [StringLength(50)]
    public string? ContactTempStreetName { get; set; }

    [StringLength(50)]
    public string? ContactTempDwellingNmuber { get; set; }

    public long? ContactTempCountryId { get; set; }

    public long? ContactTempStateId { get; set; }

    public long? ContactTempCityId { get; set; }

    [StringLength(50)]
    public string? ContactTempPostalCode { get; set; }

    [StringLength(50)]
    public string? ContactTempHomePhone { get; set; }

    [StringLength(50)]
    public string? ContactTempWorkPhone { get; set; }

    [StringLength(50)]
    public string? ContactTempFax { get; set; }

    [StringLength(50)]
    public string? ContactTempCellPhone { get; set; }

    [StringLength(50)]
    public string? ContactTempEmail { get; set; }

    [StringLength(50)]
    public string? ContactOtherStreetName { get; set; }

    [StringLength(50)]
    public string? ContactOtherDwellingNumber { get; set; }

    public long? ContactOtherCountryId { get; set; }

    public long? ContactOtherStateId { get; set; }

    public long? ContactOtherCityId { get; set; }

    [StringLength(50)]
    public string? ContactOtherPostalCode { get; set; }

    [StringLength(50)]
    public string? ContactOtherHomePhone { get; set; }

    [StringLength(50)]
    public string? ContactOtherWorkPhone { get; set; }

    [StringLength(50)]
    public string? ContactOtherFax { get; set; }

    [StringLength(50)]
    public string? ContactOtherCellPhone { get; set; }

    [StringLength(50)]
    public string? ContactOtherEmail { get; set; }

    [Column("ERContactRelationshipId")]
    public long? ErcontactRelationshipId { get; set; }

    [Column("ERContactFirstName")]
    [StringLength(50)]
    public string? ErcontactFirstName { get; set; }

    [Column("ERContactMiddleName")]
    [StringLength(50)]
    public string? ErcontactMiddleName { get; set; }

    [Column("ERContactLastName")]
    [StringLength(50)]
    public string? ErcontactLastName { get; set; }

    [Column("ERContactNationalId")]
    public long? ErcontactNationalId { get; set; }

    [Column("ERContactStreetName")]
    [StringLength(50)]
    public string? ErcontactStreetName { get; set; }

    [Column("ERContactDwellingNumber")]
    [StringLength(50)]
    public string? ErcontactDwellingNumber { get; set; }

    [Column("ERContactCountryId")]
    public long? ErcontactCountryId { get; set; }

    [Column("ERContactStateId")]
    public long? ErcontactStateId { get; set; }

    [Column("ERContactCityId")]
    public long? ErcontactCityId { get; set; }

    [Column("ERContactPostalCode")]
    [StringLength(50)]
    public string? ErcontactPostalCode { get; set; }

    [Column("ERContactHomePhone")]
    [StringLength(50)]
    public string? ErcontactHomePhone { get; set; }

    [Column("ERContactWorkPhone")]
    [StringLength(50)]
    public string? ErcontactWorkPhone { get; set; }

    [Column("ERContactCellPhone")]
    [StringLength(50)]
    public string? ErcontactCellPhone { get; set; }

    [Column("NOKRelationShipId")]
    public long? NokrelationShipId { get; set; }

    [Column("NOKFirstName")]
    [StringLength(50)]
    public string? NokfirstName { get; set; }

    [Column("NOKMiddleName")]
    [StringLength(50)]
    public string? NokmiddleName { get; set; }

    [Column("NOKLastName")]
    [StringLength(50)]
    public string? NoklastName { get; set; }

    [Column("NOKNationalId")]
    public long? NoknationalId { get; set; }

    [Column("NOKStreetName")]
    [StringLength(50)]
    public string? NokstreetName { get; set; }

    [Column("NOKDwellingNumber")]
    [StringLength(50)]
    public string? NokdwellingNumber { get; set; }

    [Column("NOKCountryId")]
    public long? NokcountryId { get; set; }

    [Column("NOKStateId")]
    public long? NokstateId { get; set; }

    [Column("NOKCityId")]
    public long? NokcityId { get; set; }

    [Column("NOKPostalCode")]
    [StringLength(50)]
    public string? NokpostalCode { get; set; }

    [Column("NOKHomePhone")]
    [StringLength(50)]
    public string? NokhomePhone { get; set; }

    [Column("NOKWorkPhone")]
    [StringLength(50)]
    public string? NokworkPhone { get; set; }

    [Column("NOKCellPhone")]
    [StringLength(50)]
    public string? NokcellPhone { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }
}
