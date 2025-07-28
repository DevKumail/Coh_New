using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("Action")]
    public partial class Action
    {
        public Action()
        {
            AuditLogs = new HashSet<AuditLog>();
        }

        [Key]
        public long ActionId { get; set; }
        [Required]
        [StringLength(200)]
        [Unicode(false)]
        public string ActionName { get; set; }
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

        [InverseProperty("Action")]
        public virtual ICollection<AuditLog> AuditLogs { get; set; }
    }
}
