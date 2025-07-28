using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("SchPatientStatus")]
    public partial class SchPatientStatus
    {
        public SchPatientStatus()
        {
            PatientVisitStatuses = new HashSet<PatientVisitStatus>();
            SchAppointments = new HashSet<SchAppointment>();
        }

        [Key]
        public int PatientStatusId { get; set; }
        [Required]
        [StringLength(50)]
        [Unicode(false)]
        public string PatientStatus { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("Status")]
        public virtual ICollection<PatientVisitStatus> PatientVisitStatuses { get; set; }
        [InverseProperty("PatientStatus")]
        public virtual ICollection<SchAppointment> SchAppointments { get; set; }
    }
}
