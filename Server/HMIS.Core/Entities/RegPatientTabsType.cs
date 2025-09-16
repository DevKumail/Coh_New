using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class RegPatientTabsType
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    public string? TypeName { get; set; }

    public bool? IsActive { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("TabsType")]
    public virtual ICollection<RegPatient> RegPatient { get; set; } = new List<RegPatient>();

    [InverseProperty("TabsType")]
    public virtual ICollection<RegPatientDetails> RegPatientDetails { get; set; } = new List<RegPatientDetails>();
}
