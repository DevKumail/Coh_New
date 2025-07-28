using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Keyless]
    [Table("AvailableMRNo")]
    public partial class AvailableMrno
    {
        [Required]
        [Column("MRNo")]
        [StringLength(10)]
        [Unicode(false)]
        public string Mrno { get; set; }
        [Required]
        [StringLength(25)]
        [Unicode(false)]
        public string DeletedBy { get; set; }
        [Required]
        [StringLength(14)]
        [Unicode(false)]
        public string DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
