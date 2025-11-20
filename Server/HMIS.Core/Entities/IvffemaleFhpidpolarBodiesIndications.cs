using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFFemaleFHPIDPolarBodiesIndications")]
public partial class IvffemaleFhpidpolarBodiesIndications
{
    [Key]
    [Column("PIDPolarBodiesIndicationId")]
    public int PidpolarBodiesIndicationId { get; set; }

    [Column("IVFFemaleFHAdditionalMeasuresId")]
    public int? IvffemaleFhadditionalMeasuresId { get; set; }

    [Column("PIDPolarBodiesIndicationCategoryId")]
    public long? PidpolarBodiesIndicationCategoryId { get; set; }

    [ForeignKey("IvffemaleFhadditionalMeasuresId")]
    [InverseProperty("IvffemaleFhpidpolarBodiesIndications")]
    public virtual IvffemaleFhadditionalMeasures? IvffemaleFhadditionalMeasures { get; set; }

    [ForeignKey("PidpolarBodiesIndicationCategoryId")]
    [InverseProperty("IvffemaleFhpidpolarBodiesIndications")]
    public virtual DropdownConfiguration? PidpolarBodiesIndicationCategory { get; set; }
}
