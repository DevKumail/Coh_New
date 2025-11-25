using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
public partial class ClinicalUsage
{
    public int ClinicalUsageId { get; set; }

    [Column("ClinicalUsage")]
    [StringLength(50)]
    [Unicode(false)]
    public string? ClinicalUsage1 { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? ColorName { get; set; }

    public bool? Active { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }
}
