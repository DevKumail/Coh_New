using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("EMRProviderEncounterPath")]
public partial class EmrproviderEncounterPath
{
    [Key]
    public long ProviderEncounterPathId { get; set; }

    public long ProviderId { get; set; }

    public int EncounterPathId { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string UpdatedBy { get; set; } = null!;

    [StringLength(14)]
    [Unicode(false)]
    public string UpdatedDate { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
