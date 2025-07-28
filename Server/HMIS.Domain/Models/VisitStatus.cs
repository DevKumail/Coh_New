using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("VisitStatus")]
    public partial class VisitStatus
    {
        public VisitStatus()
        {
            PatientVisitStatuses = new HashSet<PatientVisitStatus>();
            SchAppointments = new HashSet<SchAppointment>();
        }

        [Key]
        public int VisitStatusId { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string VisitStatusName { get; set; }
        public bool? Active { get; set; }
        [Column("HL7Notify")]
        public bool? Hl7notify { get; set; }
        public bool? IsDeleted { get; set; }

        [InverseProperty("VisitStatus")]
        public virtual ICollection<PatientVisitStatus> PatientVisitStatuses { get; set; }
        [InverseProperty("VisitStatus")]
        public virtual ICollection<SchAppointment> SchAppointments { get; set; }
    }
}
