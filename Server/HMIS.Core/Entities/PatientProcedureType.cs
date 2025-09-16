using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("PatientProcedure_Type")]
public partial class PatientProcedureType
{
    [Key]
    public long Id { get; set; }

    [StringLength(100)]
    public string? Name { get; set; }

    [InverseProperty("ProcedureTypeNavigation")]
    public virtual ICollection<PatientProcedure> PatientProcedure { get; set; } = new List<PatientProcedure>();
}
