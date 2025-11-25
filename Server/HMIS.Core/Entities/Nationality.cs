using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class Nationality
{
    [Key]
    public int NationalityId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string NationalityName { get; set; } = null!;

    [StringLength(20)]
    [Unicode(false)]
    public string? NationalityCode { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string? MalaffiCode { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [InverseProperty("PersonNationality")]
    public virtual ICollection<RegPatientTemp> RegPatientTemp { get; set; } = new List<RegPatientTemp>();
}
