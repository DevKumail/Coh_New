using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("BL_EClaimEncounterType")]
    public partial class BlEclaimEncounterType
    {
        [Key]
        public long Id { get; set; }
        public int Code { get; set; }
        [Required]
        [StringLength(500)]
        [Unicode(false)]
        public string Text { get; set; }
        [Column("isActive")]
        public bool IsActive { get; set; }
        [Column("isDeleted")]
        public bool IsDeleted { get; set; }
    }
}
