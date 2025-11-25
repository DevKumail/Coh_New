using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class RegTitle
{
    [Key]
    public byte TitleId { get; set; }

    [StringLength(255)]
    public string? Title { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [InverseProperty("PersonTitle")]
    public virtual ICollection<RegPatientTemp> RegPatientTemp { get; set; } = new List<RegPatientTemp>();
}
