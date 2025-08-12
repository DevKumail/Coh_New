using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("RegRelationShip")]
public partial class RegRelationShip
{
    [Key]
    public int RelationshipId { get; set; }

    [StringLength(255)]
    public string? Relationship { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("RelationShip")]
    public virtual ICollection<PatientChartFamilyHistory> PatientChartFamilyHistories { get; set; } = new List<PatientChartFamilyHistory>();

    [InverseProperty("Relationship")]
    public virtual ICollection<RegAccount> RegAccounts { get; set; } = new List<RegAccount>();

    [InverseProperty("Relationship")]
    public virtual ICollection<RegPatientDetail> RegPatientDetails { get; set; } = new List<RegPatientDetail>();
}
