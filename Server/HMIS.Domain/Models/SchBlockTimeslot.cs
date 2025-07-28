using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    public partial class SchBlockTimeslot
    {
        [Key]
        [Column("BTSId")]
        public long Btsid { get; set; }
        public long ProviderId { get; set; }
        [Required]
        [StringLength(300)]
        [Unicode(false)]
        public string Reason { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? EffectiveDateTime { get; set; }
        [Required]
        [StringLength(25)]
        [Unicode(false)]
        public string EnteredBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? EntryDateTime { get; set; }
        public long? SiteId { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
