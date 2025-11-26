using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
[Table("TabDrugsName_Backup")]
public partial class TabDrugsNameBackup
{
    public long DrugId { get; set; }

    [StringLength(255)]
    public string? TradeName { get; set; }

    [StringLength(255)]
    public string? Form { get; set; }

    [StringLength(255)]
    public string? Dose { get; set; }

    public bool Active { get; set; }

    [StringLength(255)]
    public string? Route { get; set; }

    public bool? Controlled { get; set; }

    public bool? IsImmunization { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Price { get; set; }

    public bool? IsInventoryItem { get; set; }

    [StringLength(11)]
    public string? Code { get; set; }

    [Column("PackageID")]
    public long? PackageId { get; set; }

    [StringLength(255)]
    public string? GreenRainCode { get; set; }

    [Column("ProductID")]
    public long? ProductId { get; set; }

    [Column("VmpID")]
    public long? VmpId { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? PackageName { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? GenericName { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? PackageSize { get; set; }

    [Column(TypeName = "money")]
    public decimal? PackagePriceToPublic { get; set; }

    [Column(TypeName = "money")]
    public decimal? PackagePriceToPharmacy { get; set; }

    [Column(TypeName = "money")]
    public decimal? UnitPriceToPublic { get; set; }

    [Column(TypeName = "money")]
    public decimal? UnitPriceToPharmacy { get; set; }

    public bool? NewStatus { get; set; }

    [Column(TypeName = "smalldatetime")]
    public DateTime? DeleteEffectiveDate { get; set; }

    [Column(TypeName = "smalldatetime")]
    public DateTime? LastChange { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? NewComments { get; set; }

    [Column(TypeName = "money")]
    public decimal? PreviousPrice { get; set; }

    [Column(TypeName = "smalldatetime")]
    public DateTime? PreviousPriceDate { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? AgentName { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? ManufacturerName { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Source { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? InsurancePlan { get; set; }

    public bool? InPharmacyStock { get; set; }

    public bool? IsDisplayed { get; set; }

    [Column("status")]
    [StringLength(10)]
    public string? Status { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? IngredientStrength { get; set; }

    public int? GranularUnit { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? RegisteredOwner { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? DosageFormPackage { get; set; }

    [Column("StateID")]
    public int? StateId { get; set; }

    [Column("isAntibioticDrug")]
    public bool? IsAntibioticDrug { get; set; }

    [Column("isApprovedFormulary")]
    public bool? IsApprovedFormulary { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? DispensingMode { get; set; }

    [StringLength(20)]
    public string? OldGreenRainCode { get; set; }

    [Column("DHA_GenericName")]
    [StringLength(1000)]
    [Unicode(false)]
    public string? DhaGenericName { get; set; }

    [Column("DHA_ROA_CODE")]
    [StringLength(20)]
    [Unicode(false)]
    public string? DhaRoaCode { get; set; }

    [StringLength(100)]
    public string? DrugCode { get; set; }

    [StringLength(100)]
    public string? GenericCode { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Strength { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? DosageForm { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? DispenseMode { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? LastChangeDate { get; set; }

    [Column("UPPScope")]
    public bool? Uppscope { get; set; }

    [Column("IncludedInThiqaABMFormulary")]
    public bool? IncludedInThiqaAbmformulary { get; set; }

    public bool? IncludedInBasicFormulary { get; set; }

    [Column("IncludedInABM1Formulary")]
    public bool? IncludedInAbm1formulary { get; set; }

    [Column("IncludedInABM7Formulary")]
    public bool? IncludedInAbm7formulary { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? UnitMarkup { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? PackageMarkup { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ThiqaPackageRefPrice { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ThiqaRefCoPayAmount { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? BasicCoPayAmount { get; set; }

    [Column("UPPEffectiveDate", TypeName = "datetime")]
    public DateTime? UppeffectiveDate { get; set; }

    [Column("UPPUpdatedDate", TypeName = "datetime")]
    public DateTime? UppupdatedDate { get; set; }

    [Column("UPPExpiryDate", TypeName = "datetime")]
    public DateTime? UppexpiryDate { get; set; }

    public long NewDrugId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }
}
