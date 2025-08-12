using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BL_ProceduresGroup")]
public partial class BlProceduresGroup
{
    [Key]
    public long GroupId { get; set; }

    [StringLength(250)]
    [Unicode(false)]
    public string GroupName { get; set; } = null!;

    public long ProviderId { get; set; }

    public long? ProcedureTypeId { get; set; }

    public bool? Isdeleted { get; set; }

    [InverseProperty("ProcedureGroup")]
    public virtual ICollection<BlprocedureGroupCode> BlprocedureGroupCodes { get; set; } = new List<BlprocedureGroupCode>();

    [ForeignKey("ProcedureTypeId")]
    [InverseProperty("BlProceduresGroups")]
    public virtual ProcedureType? ProcedureType { get; set; }
}
