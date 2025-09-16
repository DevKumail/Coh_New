using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class RegOccupation
{
    [Key]
    public byte OccupationId { get; set; }

    [StringLength(255)]
    public string? Occupation { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("EmploymentOccupation")]
    public virtual ICollection<RegPatientEmployer> RegPatientEmployer { get; set; } = new List<RegPatientEmployer>();
}
