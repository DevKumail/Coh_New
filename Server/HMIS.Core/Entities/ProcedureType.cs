using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("Procedure_Type")]
public partial class ProcedureType
{
    [Key]
    public long Id { get; set; }

    [StringLength(250)]
    public string? Type { get; set; }

    [InverseProperty("ProcedureType")]
    public virtual ICollection<BlProceduresGroup> BlProceduresGroups { get; set; } = new List<BlProceduresGroup>();

    [InverseProperty("ProcedureType")]
    public virtual ICollection<BlmasterProcedure> BlmasterProcedures { get; set; } = new List<BlmasterProcedure>();

    [InverseProperty("ProcedureType")]
    public virtual ICollection<BlprocedureGroupCode> BlprocedureGroupCodes { get; set; } = new List<BlprocedureGroupCode>();
}
