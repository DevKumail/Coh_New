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

    [Column("IVFFemaleFHAdditionalMeasuresId")]
    public int? IvffemaleFhadditionalMeasuresId { get; set; }

    public long? PerformedAdditionalMeasuresCategoryId { get; set; }

    [ForeignKey("IvffemaleFhadditionalMeasuresId")]
    public virtual IvfdashboardAdditionalMeasures? IvffemaleFhadditionalMeasures { get; set; }

    [ForeignKey("PerformedAdditionalMeasuresCategoryId")]
    public virtual DropdownConfiguration? PerformedAdditionalMeasuresCategory { get; set; }
}
