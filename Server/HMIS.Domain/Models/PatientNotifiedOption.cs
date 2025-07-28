using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    public partial class PatientNotifiedOption
    {
        public PatientNotifiedOption()
        {
            SchAppointments = new HashSet<SchAppointment>();
        }

        [Key]
        public int NotifiedId { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string NotifiedOptions { get; set; }
        public bool? Active { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("PatientNotified")]
        public virtual ICollection<SchAppointment> SchAppointments { get; set; }
    }
}
