using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class SecPrivilegesAssignedRole
{
    [Key]
    public int RolePrivilegeId { get; set; }

    public int RoleId { get; set; }

    public int FormPrivilegeId { get; set; }

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

    [ForeignKey("FormPrivilegeId")]
    [InverseProperty("SecPrivilegesAssignedRole")]
    public virtual SecPrivilegesAvailableForm FormPrivilege { get; set; } = null!;

    [ForeignKey("RoleId")]
    [InverseProperty("SecPrivilegesAssignedRole")]
    public virtual SecRole Role { get; set; } = null!;
}
