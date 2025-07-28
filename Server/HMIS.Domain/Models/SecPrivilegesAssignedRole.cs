using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("SecPrivilegesAssignedRole")]
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
        public string CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string UpdatedBy { get; set; }
        public bool? IsDeleted { get; set; }

        [ForeignKey("FormPrivilegeId")]
        [InverseProperty("SecPrivilegesAssignedRoles")]
        public virtual SecPrivilegesAvailableForm FormPrivilege { get; set; }
        [ForeignKey("RoleId")]
        [InverseProperty("SecPrivilegesAssignedRoles")]
        public virtual SecRole Role { get; set; }
    }
}
