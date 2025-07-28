using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("SecModuleForm")]
    public partial class SecModuleForm
    {
        public SecModuleForm()
        {
            SecPrivilegesAvailableForms = new HashSet<SecPrivilegesAvailableForm>();
            SecRoleForms = new HashSet<SecRoleForm>();
        }

        [Key]
        public int FormId { get; set; }
        public int ModuleId { get; set; }
        [Required]
        [StringLength(50)]
        [Unicode(false)]
        public string FormName { get; set; }
        [Column("HasMRNo")]
        public bool? HasMrno { get; set; }
        public bool? IsActive { get; set; }
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

        [ForeignKey("ModuleId")]
        [InverseProperty("SecModuleForms")]
        public virtual SecModule Module { get; set; }
        [InverseProperty("Form")]
        public virtual ICollection<SecPrivilegesAvailableForm> SecPrivilegesAvailableForms { get; set; }
        [InverseProperty("Form")]
        public virtual ICollection<SecRoleForm> SecRoleForms { get; set; }
    }
}
