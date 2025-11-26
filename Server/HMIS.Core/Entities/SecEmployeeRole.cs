using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class SecEmployeeRole
{
    [Key]
    public int EmployeeRoleId { get; set; }

    public long EmployeeId { get; set; }

    public int? RoleId { get; set; }

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

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [ForeignKey("EmployeeId")]
    [InverseProperty("SecEmployeeRole")]
    public virtual Hremployee Employee { get; set; } = null!;

    [ForeignKey("RoleId")]
    [InverseProperty("SecEmployeeRole")]
    public virtual SecRole? Role { get; set; }
}
