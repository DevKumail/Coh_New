using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("PromotionalMediaChannel")]
    public partial class PromotionalMediaChannel
    {
        [Key]
        public long MediaChannelId { get; set; }
        [Required]
        [StringLength(50)]
        [Unicode(false)]
        public string Name { get; set; }
        [StringLength(200)]
        [Unicode(false)]
        public string Description { get; set; }
        [Required]
        [StringLength(14)]
        [Unicode(false)]
        public string CreateDate { get; set; }
        public bool Active { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
