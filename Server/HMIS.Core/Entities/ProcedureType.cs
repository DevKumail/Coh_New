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

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [InverseProperty("ProcedureType")]
    public virtual ICollection<BlProceduresGroup> BlProceduresGroup { get; set; } = new List<BlProceduresGroup>();

    [InverseProperty("ProcedureType")]
    public virtual ICollection<BlmasterProcedures> BlmasterProcedures { get; set; } = new List<BlmasterProcedures>();

    [InverseProperty("ProcedureType")]
    public virtual ICollection<BlprocedureGroupCode> BlprocedureGroupCode { get; set; } = new List<BlprocedureGroupCode>();
}
