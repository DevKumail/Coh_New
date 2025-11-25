using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
[Table("BLUniversalToothCodes")]
public partial class BluniversalToothCodes
{
    [StringLength(50)]
    [Unicode(false)]
    public string ToothCode { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string? Tooth { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Dentition { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }
}
