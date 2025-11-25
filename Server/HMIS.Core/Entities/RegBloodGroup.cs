using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class RegBloodGroup
{
    [Key]
    public int BloodGroupId { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string BloodGroup { get; set; } = null!;

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [InverseProperty("PatientBloodGroup")]
    public virtual ICollection<RegPatient> RegPatient { get; set; } = new List<RegPatient>();
}
