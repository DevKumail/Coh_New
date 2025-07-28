using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("SchAppointmentStatus")]
    public partial class SchAppointmentStatus
    {
        public SchAppointmentStatus()
        {
            SchAppointments = new HashSet<SchAppointment>();
        }

        [Key]
        public int AppStatusId { get; set; }
        [Required]
        [StringLength(50)]
        [Unicode(false)]
        public string AppStatus { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("AppStatus")]
        public virtual ICollection<SchAppointment> SchAppointments { get; set; }
    }
}
