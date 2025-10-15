using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class RegRelationShip
{
    [Key]
    public int RelationshipId { get; set; }

    [StringLength(255)]
    public string? Relationship { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("RelationShip")]
    public virtual ICollection<PatientChartFamilyHistory> PatientChartFamilyHistory { get; set; } = new List<PatientChartFamilyHistory>();

    [InverseProperty("Relationship")]
    public virtual ICollection<RegAccount> RegAccount { get; set; } = new List<RegAccount>();

    [InverseProperty("Relationship")]
    public virtual ICollection<RegPatientDetails> RegPatientDetails { get; set; } = new List<RegPatientDetails>();
}
