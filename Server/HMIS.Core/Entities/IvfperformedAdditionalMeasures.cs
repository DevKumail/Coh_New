using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
[Table("IVFPerformedAdditionalMeasures")]
public partial class IvfperformedAdditionalMeasures
{
    public int? PerformedAdditionalMeasures { get; set; }

    [Column("IVFAdditionalMeasuresId")]
    public int? IvfadditionalMeasuresId { get; set; }

    public long? PerformedAdditionalMeasuresCategoryId { get; set; }

    [ForeignKey("IvfadditionalMeasuresId")]
    public virtual IvfdashboardAdditionalMeasures? IvfadditionalMeasures { get; set; }

    [ForeignKey("PerformedAdditionalMeasuresCategoryId")]
    public virtual DropdownConfiguration? PerformedAdditionalMeasuresCategory { get; set; }
}
