using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class RegPatientDetails
{
    [Key]
    public int Id { get; set; }

    [Unicode(false)]
    public string? StreetName { get; set; }

    [Unicode(false)]
    public string? DwellingNumber { get; set; }

    public int? CountryId { get; set; }

    public int? StateId { get; set; }

    public int? CityId { get; set; }

    [StringLength(20)]
    public string? PostalCode { get; set; }

    [StringLength(30)]
    public string? CellPhone { get; set; }

    [StringLength(30)]
    public string? HomePhone { get; set; }

    [StringLength(30)]
    public string? WorkPhone { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string? Fax { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Email { get; set; }

    public int? RelationshipId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? FullName { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? NationalId { get; set; }

    public int? GenderId { get; set; }

    [StringLength(50)]
    public string? ProofOfIncome { get; set; }

    public long? ProviderId { get; set; }

    public int? FinancialClassId { get; set; }

    public int? FeeScheduleId { get; set; }

    public int? LocationId { get; set; }

    public int? SiteId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? SignedDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ExpiryDate { get; set; }

    public int? EntityTypeId { get; set; }

    public int? ProviderReferredId { get; set; }

    public int? TabsTypeId { get; set; }

    public bool? Active { get; set; }

    public long? PatientId { get; set; }

    public bool? IsDeleted { get; set; }

    public string? Company { get; set; }

    [Column("Sector_Occupation_Id")]
    public int? SectorOccupationId { get; set; }

    [Column("Employment_Status_Id")]
    public int? EmploymentStatusId { get; set; }

    [Column("Employment_Type_Id")]
    public int? EmploymentTypeId { get; set; }

    public string? FirstName { get; set; }

    public string? MiddleName { get; set; }

    public string? LastName { get; set; }

    [Column("Mother_FirstName")]
    public string? MotherFirstName { get; set; }

    [Column("Mother_MiddleName")]
    public string? MotherMiddleName { get; set; }

    [Column("Mother_LastName")]
    public string? MotherLastName { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UnSignedDate { get; set; }

    [Column("EntityName_Id")]
    public int? EntityNameId { get; set; }

    [Column("ReferredBy_Id")]
    public int? ReferredById { get; set; }

    [Column("AccountType_Id")]
    public int? AccountTypeId { get; set; }

    [StringLength(50)]
    public string? MrNo { get; set; }

    [Column("Master_MrNo")]
    [StringLength(50)]
    public string? MasterMrNo { get; set; }

    [Column("E_RelationShipId")]
    public int? ERelationShipId { get; set; }

    [Column("Mother_HomePhone")]
    [StringLength(50)]
    public string? MotherHomePhone { get; set; }

    [Column("Mother_CellPhone")]
    [StringLength(50)]
    public string? MotherCellPhone { get; set; }

    [Column("Mother_Email")]
    [StringLength(50)]
    public string? MotherEmail { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [ForeignKey("CityId")]
    [InverseProperty("RegPatientDetails")]
    public virtual RegCities? City { get; set; }

    [ForeignKey("GenderId")]
    [InverseProperty("RegPatientDetails")]
    public virtual RegGender? Gender { get; set; }

    [ForeignKey("LocationId")]
    [InverseProperty("RegPatientDetails")]
    public virtual RegLocations? Location { get; set; }

    [ForeignKey("PatientId")]
    [InverseProperty("RegPatientDetails")]
    public virtual RegPatient? Patient { get; set; }

    [ForeignKey("ProviderId")]
    [InverseProperty("RegPatientDetails")]
    public virtual Hremployee? Provider { get; set; }

    [ForeignKey("RelationshipId")]
    [InverseProperty("RegPatientDetails")]
    public virtual RegRelationShip? Relationship { get; set; }

    [ForeignKey("SiteId")]
    [InverseProperty("RegPatientDetails")]
    public virtual RegLocationTypes? Site { get; set; }

    [ForeignKey("StateId")]
    [InverseProperty("RegPatientDetails")]
    public virtual RegStates? State { get; set; }

    [ForeignKey("TabsTypeId")]
    [InverseProperty("RegPatientDetails")]
    public virtual RegPatientTabsType? TabsType { get; set; }
}
