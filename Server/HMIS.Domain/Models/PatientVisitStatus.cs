using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("PatientVisitStatus")]
    public partial class PatientVisitStatus
    {
        [Key]
        public int PatientVisitStatusId { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? TimeIn { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? TimeOut { get; set; }
        public long? AttendingResourceId { get; set; }
        public long? LocationId { get; set; }
        public int? StatusId { get; set; }
        public int? VisitStatusId { get; set; }
        public bool? IsDeleted { get; set; }
        public long? AppointmentId { get; set; }

        [ForeignKey("AppointmentId")]
        [InverseProperty("PatientVisitStatuses")]
        public virtual SchAppointment Appointment { get; set; }
        [ForeignKey("StatusId")]
        [InverseProperty("PatientVisitStatuses")]
        public virtual SchPatientStatus Status { get; set; }
        [ForeignKey("VisitStatusId")]
        [InverseProperty("PatientVisitStatuses")]
        public virtual VisitStatus VisitStatus { get; set; }
    }
}
