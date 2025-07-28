using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("SecModule")]
    public partial class SecModule
    {
        public SecModule()
        {
            SecModuleForms = new HashSet<SecModuleForm>();
        }

        [Key]
        public int ModuleId { get; set; }
        [Required]
        [StringLength(50)]
        [Unicode(false)]
        public string ModuleName { get; set; }
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

        [InverseProperty("Module")]
        public virtual ICollection<SecModuleForm> SecModuleForms { get; set; }
    }
}
