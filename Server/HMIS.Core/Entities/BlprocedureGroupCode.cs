using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BLProcedureGroupCode")]
public partial class BlprocedureGroupCode
{
    [Key]
    public long Id { get; set; }

    public long? ProcedureMasterId { get; set; }

    public long? ProcedureGroupId { get; set; }

    public long? ProcedureTypeId { get; set; }

    [StringLength(2000)]
    public string DescriptionUser { get; set; } = null!;

    public bool? IsDeleted { get; set; }

    [Column(TypeName = "money")]
    public decimal? UnitPrice { get; set; }

    [StringLength(2000)]
    public string ProviderDescription { get; set; } = null!;

    public long? PayerId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("PayerId")]
    [InverseProperty("BlprocedureGroupCode")]
    public virtual Blpayer? Payer { get; set; }

    [ForeignKey("ProcedureGroupId")]
    [InverseProperty("BlprocedureGroupCode")]
    public virtual BlProceduresGroup? ProcedureGroup { get; set; }

    [ForeignKey("ProcedureMasterId")]
    [InverseProperty("BlprocedureGroupCode")]
    public virtual BlmasterProcedures? ProcedureMaster { get; set; }

    [ForeignKey("ProcedureTypeId")]
    [InverseProperty("BlprocedureGroupCode")]
    public virtual ProcedureType? ProcedureType { get; set; }
}
