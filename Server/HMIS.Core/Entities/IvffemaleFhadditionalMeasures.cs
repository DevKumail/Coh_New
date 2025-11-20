using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFFemaleFHAdditionalMeasures")]
public partial class IvffemaleFhadditionalMeasures
{
    [Key]
    [Column("IVFFemaleFHAdditionalMeasuresId")]
    public int IvffemaleFhadditionalMeasuresId { get; set; }

    [StringLength(50)]
    public string? GeneralCondition { get; set; }

    [InverseProperty("IvffemaleFhadditionalMeasures")]
    public virtual ICollection<IvffemaleFhpidpolarBodiesIndications> IvffemaleFhpidpolarBodiesIndications { get; set; } = new List<IvffemaleFhpidpolarBodiesIndications>();

    [InverseProperty("IvffemaleFhadditionalMeasures")]
    public virtual ICollection<IvffemaleFhplannedAdditionalMeasures> IvffemaleFhplannedAdditionalMeasures { get; set; } = new List<IvffemaleFhplannedAdditionalMeasures>();
}
