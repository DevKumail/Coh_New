using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("VisitStatus")]
public partial class VisitStatus
{
    [Key]
    public int VisitStatusId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? VisitStatusName { get; set; }

    public bool? Active { get; set; }

    [Column("HL7Notify")]
    public bool? Hl7notify { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("VisitStatus")]
    public virtual ICollection<PatientVisitStatus> PatientVisitStatuses { get; set; } = new List<PatientVisitStatus>();

    [InverseProperty("VisitStatus")]
    public virtual ICollection<SchAppointment> SchAppointments { get; set; } = new List<SchAppointment>();
}
