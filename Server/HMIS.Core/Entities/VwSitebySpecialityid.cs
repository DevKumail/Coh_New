using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
public partial class VwSitebySpecialityid
{
    [StringLength(35)]
    [Unicode(false)]
    public string SiteName { get; set; } = null!;

    public int SiteId { get; set; }

    [Column("SpecialtyID")]
    public int SpecialtyId { get; set; }
}
