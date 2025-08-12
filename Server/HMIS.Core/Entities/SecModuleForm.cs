using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("SecModuleForm")]
public partial class SecModuleForm
{
    [Key]
    public int FormId { get; set; }

    public int ModuleId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string FormName { get; set; } = null!;

    [Column("HasMRNo")]
    public bool? HasMrno { get; set; }

    public bool? IsActive { get; set; }

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

    [ForeignKey("ModuleId")]
    [InverseProperty("SecModuleForms")]
    public virtual SecModule Module { get; set; } = null!;

    [InverseProperty("Form")]
    public virtual ICollection<SecPrivilegesAvailableForm> SecPrivilegesAvailableForms { get; set; } = new List<SecPrivilegesAvailableForm>();

    [InverseProperty("Form")]
    public virtual ICollection<SecRoleForm> SecRoleForms { get; set; } = new List<SecRoleForm>();
}
