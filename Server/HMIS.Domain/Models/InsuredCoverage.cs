using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("InsuredCoverage")]
    public partial class InsuredCoverage
    {
        [Key]
        [Column("MRNo")]
        [StringLength(10)]
        [Unicode(false)]
        public string Mrno { get; set; }
        [Key]
        [StringLength(2)]
        [Unicode(false)]
        public string RelationCode { get; set; }
        [Key]
        public long SubscriberId { get; set; }
        [Key]
        public byte CoverageOrder { get; set; }
        public bool? IsSelected { get; set; }
        [Column("oldMRNo")]
        [StringLength(20)]
        [Unicode(false)]
        public string OldMrno { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
