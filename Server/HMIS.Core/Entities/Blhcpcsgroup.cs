using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BLHCPCSGroup")]
public partial class Blhcpcsgroup
{
    [Key]
    public long GroupId { get; set; }

    [StringLength(250)]
    [Unicode(false)]
    public string GroupName { get; set; } = null!;

    public long ProviderId { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [InverseProperty("Group")]
    public virtual ICollection<BlhcpcsgroupCode> BlhcpcsgroupCode { get; set; } = new List<BlhcpcsgroupCode>();
}
