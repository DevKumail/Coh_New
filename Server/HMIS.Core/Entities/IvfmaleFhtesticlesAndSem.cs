using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleFHTesticlesAndSem")]
public partial class IvfmaleFhtesticlesAndSem
{
    [Key]
    [Column("IVFMaleFHTesticlesAndSemId")]
    public int IvfmaleFhtesticlesAndSemId { get; set; }

    [Column("IVFMaleFHId")]
    public int? IvfmaleFhid { get; set; }

    public bool? PrimaryHypogonadotropy { get; set; }

    public bool? SecondaryHypogonadotropy { get; set; }

    public bool? RetractileTestes { get; set; }

    public long? CategoryIdTesticle { get; set; }

    public long? CategoryIdKryptorchidism { get; set; }

    public long? CategoryIdOrchitis { get; set; }

    [StringLength(20)]
    public string? TesticleVolumeLeft { get; set; }

    [StringLength(20)]
    public string? TesticleVolumeRight { get; set; }

    public bool? Varicocele { get; set; }

    public bool? OperatedVaricocele { get; set; }

    public long? CategoryIdInstrumentalVaricocele { get; set; }

    public long? CategoryIdClinicalVaricocele { get; set; }

    public bool? ObstipationOfSpermaticDuct { get; set; }

    public long? CategoryIdProximalSeminalTract { get; set; }

    public long? CategoryIdDistalSeminalTract { get; set; }

    public long? CategoryIdEtiologicalDiagnosis { get; set; }

    public bool? Inflammation { get; set; }

    public string? Note { get; set; }

    [ForeignKey("CategoryIdClinicalVaricocele")]
    [InverseProperty("IvfmaleFhtesticlesAndSemCategoryIdClinicalVaricoceleNavigation")]
    public virtual DropdownConfiguration? CategoryIdClinicalVaricoceleNavigation { get; set; }

    [ForeignKey("CategoryIdDistalSeminalTract")]
    [InverseProperty("IvfmaleFhtesticlesAndSemCategoryIdDistalSeminalTractNavigation")]
    public virtual DropdownConfiguration? CategoryIdDistalSeminalTractNavigation { get; set; }

    [ForeignKey("CategoryIdEtiologicalDiagnosis")]
    [InverseProperty("IvfmaleFhtesticlesAndSemCategoryIdEtiologicalDiagnosisNavigation")]
    public virtual DropdownConfiguration? CategoryIdEtiologicalDiagnosisNavigation { get; set; }

    [ForeignKey("CategoryIdInstrumentalVaricocele")]
    [InverseProperty("IvfmaleFhtesticlesAndSemCategoryIdInstrumentalVaricoceleNavigation")]
    public virtual DropdownConfiguration? CategoryIdInstrumentalVaricoceleNavigation { get; set; }

    [ForeignKey("CategoryIdKryptorchidism")]
    [InverseProperty("IvfmaleFhtesticlesAndSemCategoryIdKryptorchidismNavigation")]
    public virtual DropdownConfiguration? CategoryIdKryptorchidismNavigation { get; set; }

    [ForeignKey("CategoryIdOrchitis")]
    [InverseProperty("IvfmaleFhtesticlesAndSemCategoryIdOrchitisNavigation")]
    public virtual DropdownConfiguration? CategoryIdOrchitisNavigation { get; set; }

    [ForeignKey("CategoryIdProximalSeminalTract")]
    [InverseProperty("IvfmaleFhtesticlesAndSemCategoryIdProximalSeminalTractNavigation")]
    public virtual DropdownConfiguration? CategoryIdProximalSeminalTractNavigation { get; set; }

    [ForeignKey("CategoryIdTesticle")]
    [InverseProperty("IvfmaleFhtesticlesAndSemCategoryIdTesticleNavigation")]
    public virtual DropdownConfiguration? CategoryIdTesticleNavigation { get; set; }

    [ForeignKey("IvfmaleFhid")]
    [InverseProperty("IvfmaleFhtesticlesAndSem")]
    public virtual IvfmaleFertilityHistory? IvfmaleFh { get; set; }

    [InverseProperty("IvfmaleFhtesticlesAndSem")]
    public virtual ICollection<IvfmaleFhinfections> IvfmaleFhinfections { get; set; } = new List<IvfmaleFhinfections>();
}
