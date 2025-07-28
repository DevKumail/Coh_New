using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("SocialFamilyHistoryMaster")]
    public partial class SocialFamilyHistoryMaster
    {
        public SocialFamilyHistoryMaster()
        {
            PatientChartSocialHistories = new HashSet<PatientChartSocialHistory>();
        }

        [Key]
        [Column("SHID")]
        public long Shid { get; set; }
        [Required]
        [Column("SHName")]
        [StringLength(50)]
        public string Shname { get; set; }
        public bool? Active { get; set; }
        [StringLength(50)]
        public string ObservationCode { get; set; }

        [InverseProperty("ShitemNavigation")]
        public virtual ICollection<PatientChartSocialHistory> PatientChartSocialHistories { get; set; }
    }
}
