using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("LoginUserHistory")]
public partial class LoginUserHistory
{
    [Key]
    public long UserLoginHistoryId { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? Token { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? LoginUserName { get; set; }

    [Column("IPAddress")]
    [StringLength(50)]
    [Unicode(false)]
    public string? Ipaddress { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? LoginTime { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? LogoffTime { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? LastActivityTime { get; set; }

    public bool? UserLogOut { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedOn { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? UpdatedBy { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("UserLoginHistory")]
    public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
}
