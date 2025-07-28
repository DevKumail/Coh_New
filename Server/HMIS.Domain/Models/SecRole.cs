using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("SecRole")]
    public partial class SecRole
    {
        public SecRole()
        {
            SecEmployeeRoles = new HashSet<SecEmployeeRole>();
            SecPrivilegesAssignedRoles = new HashSet<SecPrivilegesAssignedRole>();
            TaskForwardings = new HashSet<TaskForwarding>();
        }

        [Key]
        public int RoleId { get; set; }
        [Required]
        [StringLength(60)]
        [Unicode(false)]
        public string RoleName { get; set; }
        public bool IsActive { get; set; }
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

        [InverseProperty("Role")]
        public virtual ICollection<SecEmployeeRole> SecEmployeeRoles { get; set; }
        [InverseProperty("Role")]
        public virtual ICollection<SecPrivilegesAssignedRole> SecPrivilegesAssignedRoles { get; set; }
        [InverseProperty("ReceiverRole")]
        public virtual ICollection<TaskForwarding> TaskForwardings { get; set; }
    }
}
