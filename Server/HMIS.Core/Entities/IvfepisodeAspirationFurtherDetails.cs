using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFEpisodeAspirationFurtherDetails")]
[Index("AspirationId", Name = "IX_IVFEpisodeAspirationFurtherDetails", IsUnique = true)]
public partial class IvfepisodeAspirationFurtherDetails
{
    [Key]
    public long FurtherDetailsId { get; set; }

    public long AspirationId { get; set; }

    public long? AspirationSystemCategoryId { get; set; }

    public int? LeadingFollicleSize { get; set; }

    public int? NoOfWashedFollicles { get; set; }

    public bool? FolliclesWashed { get; set; }

    public int? RetrievedFolliclesTotal { get; set; }

    public int? RetrievedFolliclesLeft { get; set; }

    public int? RetrievedFolliclesRight { get; set; }

    [Column("TotalDoseAdministeredLH")]
    public int? TotalDoseAdministeredLh { get; set; }

    [Column("TotalDoseAdministeredFSH")]
    public int? TotalDoseAdministeredFsh { get; set; }

    [Column("TotalDoseAdministeredHMG")]
    public int? TotalDoseAdministeredHmg { get; set; }

    public long? GeneralConditionCategoryId { get; set; }

    public long? MucousMembraneCategoryId { get; set; }

    [Column(TypeName = "decimal(8, 2)")]
    public decimal? Temperature { get; set; }

    [Column(TypeName = "decimal(8, 2)")]
    public decimal? BeforeOocyteRetrievalPulse { get; set; }

    [Column(TypeName = "decimal(8, 2)")]
    public decimal? BeforeOocyteRetrievalBloodPressureSystolic { get; set; }

    [Column(TypeName = "decimal(8, 2)")]
    public decimal? BeforeOocyteRetrievalBloodPressureDiastolic { get; set; }

    [Column(TypeName = "decimal(8, 2)")]
    public decimal? AnaesthetistPulse { get; set; }

    [Column(TypeName = "decimal(8, 2)")]
    public decimal? AnaesthetistBloodPressureSystolic { get; set; }

    [Column(TypeName = "decimal(8, 2)")]
    public decimal? AnaesthetistBloodPressureDiastolic { get; set; }

    public string? Note { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("AspirationId")]
    [InverseProperty("IvfepisodeAspirationFurtherDetails")]
    public virtual IvftreatmentEpisodeAspirationStage Aspiration { get; set; } = null!;

    [ForeignKey("AspirationSystemCategoryId")]
    [InverseProperty("IvfepisodeAspirationFurtherDetailsAspirationSystemCategory")]
    public virtual DropdownConfiguration? AspirationSystemCategory { get; set; }

    [ForeignKey("GeneralConditionCategoryId")]
    [InverseProperty("IvfepisodeAspirationFurtherDetailsGeneralConditionCategory")]
    public virtual DropdownConfiguration? GeneralConditionCategory { get; set; }

    [ForeignKey("MucousMembraneCategoryId")]
    [InverseProperty("IvfepisodeAspirationFurtherDetailsMucousMembraneCategory")]
    public virtual DropdownConfiguration? MucousMembraneCategory { get; set; }
}
