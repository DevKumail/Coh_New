using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    public partial class RegEthnicityType
    {
        [Key]
        public int TypeId { get; set; }
        [Required]
        [StringLength(50)]
        [Unicode(false)]
        public string Name { get; set; }
        [StringLength(200)]
        [Unicode(false)]
        public string Description { get; set; }
        [StringLength(5)]
        [Unicode(false)]
        public string Code { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
