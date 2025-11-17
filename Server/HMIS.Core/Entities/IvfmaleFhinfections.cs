using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleFHInfections")]
public partial class IvfmaleFhinfections
{
    [Key]
    [Column("IVFMaleFHInfectionsId")]
    public int IvfmaleFhinfectionsId { get; set; }

    [Column("IVFMaleFHTesticlesAndSemId")]
    public int IvfmaleFhtesticlesAndSemId { get; set; }

    public bool? Urethritis { get; set; }

    public bool? Prostatitis { get; set; }

    public bool? Epididymitis { get; set; }

    public long CategoryIdPrevInfections { get; set; }

    public long CategoryIdDiagnosisOfInfection { get; set; }

    [ForeignKey("CategoryIdDiagnosisOfInfection")]
    [InverseProperty("IvfmaleFhinfectionsCategoryIdDiagnosisOfInfectionNavigation")]
    public virtual DropdownConfiguration CategoryIdDiagnosisOfInfectionNavigation { get; set; } = null!;

    [ForeignKey("CategoryIdPrevInfections")]
    [InverseProperty("IvfmaleFhinfectionsCategoryIdPrevInfectionsNavigation")]
    public virtual DropdownConfiguration CategoryIdPrevInfectionsNavigation { get; set; } = null!;

    [ForeignKey("IvfmaleFhtesticlesAndSemId")]
    [InverseProperty("IvfmaleFhinfections")]
    public virtual IvfmaleFhtesticlesAndSem IvfmaleFhtesticlesAndSem { get; set; } = null!;
}
