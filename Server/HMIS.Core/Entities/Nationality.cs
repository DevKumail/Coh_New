using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("Nationality")]
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

    [InverseProperty("PersonNationality")]
    public virtual ICollection<RegPatientTemp> RegPatientTemps { get; set; } = new List<RegPatientTemp>();
}
