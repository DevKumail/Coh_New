using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("ProviderSchedule")]
    public partial class ProviderSchedule
    {
        public ProviderSchedule()
        {
            ProviderScheduleByAppTypes = new HashSet<ProviderScheduleByAppType>();
        }

        [Key]
        [Column("PSId")]
        public long Psid { get; set; }
        public long ProviderId { get; set; }
        public int SiteId { get; set; }
        public int UsageId { get; set; }
        [Required]
        [StringLength(20)]
        [Unicode(false)]
        public string StartTime { get; set; }
        [Required]
        [StringLength(20)]
        [Unicode(false)]
        public string EndTime { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? StartDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? EndDate { get; set; }
        [StringLength(20)]
        [Unicode(false)]
        public string BreakStartTime { get; set; }
        [StringLength(20)]
        [Unicode(false)]
        public string BreakEndTime { get; set; }
        [StringLength(20)]
        [Unicode(false)]
        public string BreakReason { get; set; }
        public short? AppPerHour { get; set; }
        public short? MaxOverloadApps { get; set; }
        public int? Priority { get; set; }
        public bool Active { get; set; }
        [StringLength(25)]
        [Unicode(false)]
        public string CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedDate { get; set; }
        [StringLength(25)]
        [Unicode(false)]
        public string UpdatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedDate { get; set; }
        public bool? Sunday { get; set; }
        public bool? Monday { get; set; }
        public bool? Tuesday { get; set; }
        public bool? Wednesday { get; set; }
        public bool? Thursday { get; set; }
        public bool? Friday { get; set; }
        public bool? Saturday { get; set; }
        public bool? IsDeleted { get; set; }
        public int? FacilityId { get; set; }
        public int? SpecialityId { get; set; }

        [ForeignKey("FacilityId")]
        [InverseProperty("ProviderSchedules")]
        public virtual RegFacility Facility { get; set; }
        [ForeignKey("SpecialityId")]
        [InverseProperty("ProviderSchedules")]
        public virtual ProviderSpecialty Speciality { get; set; }
        [InverseProperty("Ps")]
        public virtual ICollection<ProviderScheduleByAppType> ProviderScheduleByAppTypes { get; set; }
    }
}
