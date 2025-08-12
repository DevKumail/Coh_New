using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class PatientNotifiedOption
{
    [Key]
    public int NotifiedId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? NotifiedOptions { get; set; }

    public bool? Active { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("PatientNotified")]
    public virtual ICollection<SchAppointment> SchAppointments { get; set; } = new List<SchAppointment>();
}
