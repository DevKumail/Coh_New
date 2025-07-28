using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("SchPatientCall")]
    public partial class SchPatientCall
    {
        [Key]
        [Column("CallID")]
        public long CallId { get; set; }
        public int CallNo { get; set; }
        [Required]
        [Column("MRNo")]
        [StringLength(10)]
        [Unicode(false)]
        public string Mrno { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CallDate { get; set; }
        [Column("oldMRNo")]
        [StringLength(20)]
        [Unicode(false)]
        public string OldMrno { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
