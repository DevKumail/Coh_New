using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("SchPatientStatus")]
public partial class SchPatientStatus
{
    [Key]
    public int PatientStatusId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string PatientStatus { get; set; } = null!;

    public bool? IsDeleted { get; set; }

    [InverseProperty("Status")]
    public virtual ICollection<PatientVisitStatus> PatientVisitStatuses { get; set; } = new List<PatientVisitStatus>();

    [InverseProperty("PatientStatus")]
    public virtual ICollection<SchAppointment> SchAppointments { get; set; } = new List<SchAppointment>();
}
