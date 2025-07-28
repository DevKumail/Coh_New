using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("BLHCPCSGroup")]
    public partial class Blhcpcsgroup
    {
        public Blhcpcsgroup()
        {
            BlhcpcsgroupCodes = new HashSet<BlhcpcsgroupCode>();
        }

        [Key]
        public long GroupId { get; set; }
        [Required]
        [StringLength(250)]
        [Unicode(false)]
        public string GroupName { get; set; }
        public long ProviderId { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("Group")]
        public virtual ICollection<BlhcpcsgroupCode> BlhcpcsgroupCodes { get; set; }
    }
}
