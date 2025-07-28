using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("PatientChartSocialHistory")]
    public partial class PatientChartSocialHistory
    {
        [Key]
        [Column("SHID")]
        public long Shid { get; set; }
        public long? ChartId { get; set; }
        [Column("SHItem")]
        public long? Shitem { get; set; }
        [Column("MRNo")]
        [StringLength(50)]
        [Unicode(false)]
        public string Mrno { get; set; }
        public long? VisitAccountNo { get; set; }
        public long? CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedDate { get; set; }
        public bool? Active { get; set; }

        [ForeignKey("Shitem")]
        [InverseProperty("PatientChartSocialHistories")]
        public virtual SocialFamilyHistoryMaster ShitemNavigation { get; set; }
    }
}
