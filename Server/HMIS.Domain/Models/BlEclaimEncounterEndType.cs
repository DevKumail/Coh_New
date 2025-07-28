using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("BL_EClaimEncounterEndType")]
    public partial class BlEclaimEncounterEndType
    {
        [Key]
        public long Id { get; set; }
        public int Code { get; set; }
        [Required]
        [StringLength(500)]
        [Unicode(false)]
        public string Text { get; set; }
        [Column("isTeleMedicine")]
        public bool IsTeleMedicine { get; set; }
        [Column("isActive")]
        public bool IsActive { get; set; }
        [Column("isDeleted")]
        public bool IsDeleted { get; set; }
    }
}
