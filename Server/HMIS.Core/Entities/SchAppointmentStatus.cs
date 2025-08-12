using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("SchAppointmentStatus")]
public partial class SchAppointmentStatus
{
    [Key]
    public int AppStatusId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string AppStatus { get; set; } = null!;

    public bool? IsDeleted { get; set; }

    [InverseProperty("AppStatus")]
    public virtual ICollection<SchAppointment> SchAppointments { get; set; } = new List<SchAppointment>();
}
