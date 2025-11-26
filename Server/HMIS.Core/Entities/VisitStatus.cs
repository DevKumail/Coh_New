using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

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

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [InverseProperty("VisitStatus")]
    public virtual ICollection<PatientVisitStatus> PatientVisitStatus { get; set; } = new List<PatientVisitStatus>();

    [InverseProperty("VisitStatus")]
    public virtual ICollection<SchAppointment> SchAppointment { get; set; } = new List<SchAppointment>();
}
