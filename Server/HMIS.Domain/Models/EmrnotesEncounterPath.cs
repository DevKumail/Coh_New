using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("EMRNotesEncounterPath")]
    public partial class EmrnotesEncounterPath
    {
        [Key]
        public long PathId { get; set; }
        [Required]
        [StringLength(100)]
        [Unicode(false)]
        public string PathName { get; set; }
        [StringLength(250)]
        [Unicode(false)]
        public string PathDescription { get; set; }
        [Column(TypeName = "ntext")]
        public string TemplateText { get; set; }
        [Column("TemplateHTML", TypeName = "ntext")]
        public string TemplateHtml { get; set; }
        [StringLength(2000)]
        [Unicode(false)]
        public string RefrenceInfo { get; set; }
        public bool Active { get; set; }
        [StringLength(30)]
        [Unicode(false)]
        public string TemplateType { get; set; }
        [StringLength(30)]
        [Unicode(false)]
        public string Category { get; set; }
        public bool? NewFormatting { get; set; }
        public bool? DisplayPatientHeader { get; set; }
        public bool? DisallowCreateAsNew { get; set; }
        public bool? IsDeleted { get; set; }
        public long? CreatedById { get; set; }
        public long? UpdatedById { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedTime { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedTime { get; set; }
    }
}
