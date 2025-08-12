using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("RegBloodGroup")]
public partial class RegBloodGroup
{
    [Key]
    public int BloodGroupId { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string BloodGroup { get; set; } = null!;

    public bool? IsDeleted { get; set; }

    [InverseProperty("PatientBloodGroup")]
    public virtual ICollection<RegPatient> RegPatients { get; set; } = new List<RegPatient>();
}
