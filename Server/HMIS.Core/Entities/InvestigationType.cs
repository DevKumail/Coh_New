using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class InvestigationType
{
    [Key]
    public int Id { get; set; }

    [StringLength(200)]
    public string? Type { get; set; }

    public bool? IsRadiologyTest { get; set; }
}
