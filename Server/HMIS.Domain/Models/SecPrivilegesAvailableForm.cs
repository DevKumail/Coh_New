using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("SecPrivilegesAvailableForm")]
    public partial class SecPrivilegesAvailableForm
    {
        public SecPrivilegesAvailableForm()
        {
            SecPrivilegesAssignedRoles = new HashSet<SecPrivilegesAssignedRole>();
        }

        [Key]
        public int FormPrivilegeId { get; set; }
        public int FormId { get; set; }
        public int PrivilegeId { get; set; }
        [Required]
        [StringLength(50)]
        [Unicode(false)]
        public string RecordType { get; set; }
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

        [ForeignKey("FormId")]
        [InverseProperty("SecPrivilegesAvailableForms")]
        public virtual SecModuleForm Form { get; set; }
        [ForeignKey("PrivilegeId")]
        [InverseProperty("SecPrivilegesAvailableForms")]
        public virtual SecPrivilege Privilege { get; set; }
        [InverseProperty("FormPrivilege")]
        public virtual ICollection<SecPrivilegesAssignedRole> SecPrivilegesAssignedRoles { get; set; }
    }
}
