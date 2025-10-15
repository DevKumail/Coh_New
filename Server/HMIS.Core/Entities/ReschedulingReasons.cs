﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class ReschedulingReasons
{
    [Key]
    public int ReSchId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Reasons { get; set; }

    public bool? Active { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("Rescheduled")]
    public virtual ICollection<SchAppointment> SchAppointment { get; set; } = new List<SchAppointment>();
}
