using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Keyless]
    [Table("TestTableType")]
    public partial class TestTableType
    {
        [Required]
        [Column("MRNo")]
        [StringLength(10)]
        [Unicode(false)]
        public string Mrno { get; set; }
        [Column("id")]
        public int Id { get; set; }
        [StringLength(14)]
        [Unicode(false)]
        public string Name { get; set; }
        [Column("isActive")]
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
