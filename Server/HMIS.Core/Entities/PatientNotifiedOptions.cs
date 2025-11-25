using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class PatientNotifiedOptions
{
    [Key]
    public int NotifiedId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? NotifiedOptions { get; set; }

    public bool? Active { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [InverseProperty("PatientNotified")]
    public virtual ICollection<SchAppointment> SchAppointment { get; set; } = new List<SchAppointment>();
}
