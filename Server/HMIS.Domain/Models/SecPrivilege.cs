using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    public partial class SecPrivilege
    {
        public SecPrivilege()
        {
            SecPrivilegesAvailableForms = new HashSet<SecPrivilegesAvailableForm>();
        }

        [Key]
        public int PrivilegeId { get; set; }
        [Required]
        [StringLength(50)]
        [Unicode(false)]
        public string Name { get; set; }
        [StringLength(150)]
        [Unicode(false)]
        public string Description { get; set; }
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

        [InverseProperty("Privilege")]
        public virtual ICollection<SecPrivilegesAvailableForm> SecPrivilegesAvailableForms { get; set; }
    }
}
