using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Index("ActionTime", Name = "IX_AuditLog_ActionTime")]
public partial class AuditLog
{
    [Key]
    public long AuditLogId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ActionTime { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? UserName { get; set; }

    public long? UserLoginHistoryId { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? ModuleName { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? FormName { get; set; }

    public long? ActionId { get; set; }

    [Unicode(false)]
    public string? ActionDetails { get; set; }

    public bool? TablesReadOrModified { get; set; }

    [Column("MRNo")]
    [StringLength(200)]
    [Unicode(false)]
    public string? Mrno { get; set; }

    [Column("MachineIP")]
    [StringLength(100)]
    [Unicode(false)]
    public string? MachineIp { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("ActionId")]
    [InverseProperty("AuditLog")]
    public virtual Action? Action { get; set; }

    [ForeignKey("UserLoginHistoryId")]
    [InverseProperty("AuditLog")]
    public virtual LoginUserHistory? UserLoginHistory { get; set; }
}
