using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class SchPatientStatus
{
    [Key]
    public int PatientStatusId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string PatientStatus { get; set; } = null!;

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [InverseProperty("Status")]
    public virtual ICollection<PatientVisitStatus> PatientVisitStatus { get; set; } = new List<PatientVisitStatus>();

    [InverseProperty("PatientStatus")]
    public virtual ICollection<SchAppointment> SchAppointment { get; set; } = new List<SchAppointment>();
}
