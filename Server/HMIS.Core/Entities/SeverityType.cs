﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class SeverityType
{
    [Key]
    public long Id { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? SeverityName { get; set; }

    [InverseProperty("SeverityCodeNavigation")]
    public virtual ICollection<PatientAllergy> PatientAllergy { get; set; } = new List<PatientAllergy>();
}
