using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("BLICD9CMGroup")]
    public partial class Blicd9cmgroup
    {
        public Blicd9cmgroup()
        {
            Blicd9cmgroupCodes = new HashSet<Blicd9cmgroupCode>();
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
        public virtual ICollection<Blicd9cmgroupCode> Blicd9cmgroupCodes { get; set; }
    }
}
