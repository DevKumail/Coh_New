using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class RegEmploymentType
{
    [Key]
    public int EmpTypeId { get; set; }

    [StringLength(255)]
    public string? EmpType { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [InverseProperty("EmploymentType")]
    public virtual ICollection<RegPatientEmployer> RegPatientEmployer { get; set; } = new List<RegPatientEmployer>();
}
