using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
[Table("IVFFemaleFHPerformedAdditionalMeasures")]
public partial class IvffemaleFhperformedAdditionalMeasures
{
    public int? PerformedAdditionalMeasures { get; set; }

    [Column("IVFFemaleFHAdditionalMeasuresId")]
    public int? IvffemaleFhadditionalMeasuresId { get; set; }

    public long? PerformedAdditionalMeasuresCategoryId { get; set; }

    [ForeignKey("IvffemaleFhadditionalMeasuresId")]
    public virtual IvffemaleFhadditionalMeasures? IvffemaleFhadditionalMeasures { get; set; }

    [ForeignKey("PerformedAdditionalMeasuresCategoryId")]
    public virtual DropdownConfiguration? PerformedAdditionalMeasuresCategory { get; set; }
}
