using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class DropdownConfiguration
{
    [Key]
    public long ValueId { get; set; }

    public long CategoryId { get; set; }

    [StringLength(255)]
    public string ValueName { get; set; } = null!;

    public int? SortOrder { get; set; }

    public bool IsActive { get; set; }

    [ForeignKey("CategoryId")]
    [InverseProperty("DropdownConfiguration")]
    public virtual DropdownCategory Category { get; set; } = null!;

    [InverseProperty("CategoryIdInheritanceNavigation")]
    public virtual ICollection<IvfmaleFhgenetics> IvfmaleFhgenetics { get; set; } = new List<IvfmaleFhgenetics>();

    [InverseProperty("CategoryIdDiagnosisOfInfectionNavigation")]
    public virtual ICollection<IvfmaleFhinfections> IvfmaleFhinfectionsCategoryIdDiagnosisOfInfectionNavigation { get; set; } = new List<IvfmaleFhinfections>();

    [InverseProperty("CategoryIdPrevInfectionsNavigation")]
    public virtual ICollection<IvfmaleFhinfections> IvfmaleFhinfectionsCategoryIdPrevInfectionsNavigation { get; set; } = new List<IvfmaleFhinfections>();

    [InverseProperty("CategoryIdClinicalVaricoceleNavigation")]
    public virtual ICollection<IvfmaleFhtesticlesAndSem> IvfmaleFhtesticlesAndSemCategoryIdClinicalVaricoceleNavigation { get; set; } = new List<IvfmaleFhtesticlesAndSem>();

    [InverseProperty("CategoryIdDistalSeminalTractNavigation")]
    public virtual ICollection<IvfmaleFhtesticlesAndSem> IvfmaleFhtesticlesAndSemCategoryIdDistalSeminalTractNavigation { get; set; } = new List<IvfmaleFhtesticlesAndSem>();

    [InverseProperty("CategoryIdEtiologicalDiagnosisNavigation")]
    public virtual ICollection<IvfmaleFhtesticlesAndSem> IvfmaleFhtesticlesAndSemCategoryIdEtiologicalDiagnosisNavigation { get; set; } = new List<IvfmaleFhtesticlesAndSem>();

    [InverseProperty("CategoryIdInstrumentalVaricoceleNavigation")]
    public virtual ICollection<IvfmaleFhtesticlesAndSem> IvfmaleFhtesticlesAndSemCategoryIdInstrumentalVaricoceleNavigation { get; set; } = new List<IvfmaleFhtesticlesAndSem>();

    [InverseProperty("CategoryIdKryptorchidismNavigation")]
    public virtual ICollection<IvfmaleFhtesticlesAndSem> IvfmaleFhtesticlesAndSemCategoryIdKryptorchidismNavigation { get; set; } = new List<IvfmaleFhtesticlesAndSem>();

    [InverseProperty("CategoryIdOrchitisNavigation")]
    public virtual ICollection<IvfmaleFhtesticlesAndSem> IvfmaleFhtesticlesAndSemCategoryIdOrchitisNavigation { get; set; } = new List<IvfmaleFhtesticlesAndSem>();

    [InverseProperty("CategoryIdProximalSeminalTractNavigation")]
    public virtual ICollection<IvfmaleFhtesticlesAndSem> IvfmaleFhtesticlesAndSemCategoryIdProximalSeminalTractNavigation { get; set; } = new List<IvfmaleFhtesticlesAndSem>();

    [InverseProperty("CategoryIdTesticleNavigation")]
    public virtual ICollection<IvfmaleFhtesticlesAndSem> IvfmaleFhtesticlesAndSemCategoryIdTesticleNavigation { get; set; } = new List<IvfmaleFhtesticlesAndSem>();
}
