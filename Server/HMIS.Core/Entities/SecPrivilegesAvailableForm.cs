using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("SecPrivilegesAvailableForm")]
public partial class SecPrivilegesAvailableForm
{
    [Key]
    public int FormPrivilegeId { get; set; }

    public int FormId { get; set; }

    public int PrivilegeId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string RecordType { get; set; } = null!;

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

    [ForeignKey("FormId")]
    [InverseProperty("SecPrivilegesAvailableForms")]
    public virtual SecModuleForm Form { get; set; } = null!;

    [ForeignKey("PrivilegeId")]
    [InverseProperty("SecPrivilegesAvailableForms")]
    public virtual SecPrivilege Privilege { get; set; } = null!;

    [InverseProperty("FormPrivilege")]
    public virtual ICollection<SecPrivilegesAssignedRole> SecPrivilegesAssignedRoles { get; set; } = new List<SecPrivilegesAssignedRole>();
}
