using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("BLEligibilityLog")]
    public partial class BleligibilityLog
    {
        [Key]
        public int Id { get; set; }
        public long FacilityId { get; set; }
        public int? EligibilityId { get; set; }
        [Column("ELRequestStatusId")]
        public byte? ElrequestStatusId { get; set; }
        [Column("ELStatusId")]
        public byte? ElstatusId { get; set; }
        [Required]
        [StringLength(25)]
        [Unicode(false)]
        public string CreatedBy { get; set; }
        [Required]
        [StringLength(14)]
        [Unicode(false)]
        public string CreatedDate { get; set; }
        [Unicode(false)]
        public string RequestStr { get; set; }
        [Unicode(false)]
        public string ResponseStr { get; set; }
        public byte? MessageTypeId { get; set; }
        [StringLength(14)]
        [Unicode(false)]
        public string MessageRequestDate { get; set; }
        [StringLength(14)]
        [Unicode(false)]
        public string MessageResponseDate { get; set; }
        public bool? IsDeleted { get; set; }
        public long? AppointmentId { get; set; }

        [ForeignKey("AppointmentId")]
        [InverseProperty("BleligibilityLogs")]
        public virtual SchAppointment Appointment { get; set; }
    }
}
