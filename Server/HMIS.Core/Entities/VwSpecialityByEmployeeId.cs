using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
public partial class VwSpecialityByEmployeeId
{
    [StringLength(50)]
    [Unicode(false)]
    public string? SpecialtyName { get; set; }

    [Column("SpecialtyID")]
    public int SpecialtyId { get; set; }

    public long EmployeeId { get; set; }
}
