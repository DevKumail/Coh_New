using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("CONSULTATIONCATEGORY")]
    public partial class Consultationcategory
    {
        [Key]
        [Column("CONSULTATIONCATEGORYID")]
        public int Consultationcategoryid { get; set; }
        [StringLength(100)]
        [Unicode(false)]
        public string Category { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
