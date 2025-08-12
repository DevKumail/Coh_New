using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
public partial class VwProviderByFacilityId
{
    [StringLength(50)]
    [Unicode(false)]
    public string? FullName { get; set; }

    public long EmployeeId { get; set; }

    [Column("FacilityID")]
    public int? FacilityId { get; set; }
}
