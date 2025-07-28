using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("BLCPTGroup")]
    public partial class Blcptgroup
    {
        public Blcptgroup()
        {
            BlcptgroupCodes = new HashSet<BlcptgroupCode>();
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
        public virtual ICollection<BlcptgroupCode> BlcptgroupCodes { get; set; }
    }
}
