using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("BLSitePointOfSale")]
    public partial class BlsitePointOfSale
    {
        [Required]
        [StringLength(50)]
        [Unicode(false)]
        public string Name { get; set; }
        [Required]
        [StringLength(20)]
        [Unicode(false)]
        public string TerminalNo { get; set; }
        [Key]
        public long Id { get; set; }
        public long? DefaultSiteId { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
