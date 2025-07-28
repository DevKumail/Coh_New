using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("SchAppointmentType")]
    public partial class SchAppointmentType
    {
        public SchAppointmentType()
        {
            CptbyAppTypes = new HashSet<CptbyAppType>();
            ProviderScheduleByAppTypes = new HashSet<ProviderScheduleByAppType>();
        }

        [Key]
        public int AppTypeId { get; set; }
        [Required]
        [StringLength(50)]
        [Unicode(false)]
        public string AppType { get; set; }
        public bool? IsScreening { get; set; }
        public bool? IsTelemedicine { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("AppType")]
        public virtual ICollection<CptbyAppType> CptbyAppTypes { get; set; }
        [InverseProperty("AppType")]
        public virtual ICollection<ProviderScheduleByAppType> ProviderScheduleByAppTypes { get; set; }
    }
}
