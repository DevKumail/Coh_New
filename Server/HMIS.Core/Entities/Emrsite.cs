using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("EMRSite")]
public partial class Emrsite
{
    [Key]
    public int SiteId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? SiteName { get; set; }

    public bool? Active { get; set; }

    public bool? IsDeleted { get; set; }
}
