using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFFemaleFHPlannedAdditionalMeasures")]
public partial class IvffemaleFhplannedAdditionalMeasures
{
    [Key]
    public int AdditionalMeasuresId { get; set; }

    [Column("IVFFemaleFHAdditionalMeasuresId")]
    public int? IvffemaleFhadditionalMeasuresId { get; set; }

    public long? MeasuresCategoryId { get; set; }

    [ForeignKey("IvffemaleFhadditionalMeasuresId")]
    [InverseProperty("IvffemaleFhplannedAdditionalMeasures")]
    public virtual IvffemaleFhadditionalMeasures? IvffemaleFhadditionalMeasures { get; set; }

    [ForeignKey("MeasuresCategoryId")]
    [InverseProperty("IvffemaleFhplannedAdditionalMeasures")]
    public virtual DropdownConfiguration? MeasuresCategory { get; set; }
}
