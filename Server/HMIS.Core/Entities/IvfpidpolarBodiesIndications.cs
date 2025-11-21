using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFPIDPolarBodiesIndications")]
public partial class IvfpidpolarBodiesIndications
{
    [Key]
    [Column("PIDPolarBodiesIndicationId")]
    public int PidpolarBodiesIndicationId { get; set; }

    [Column("IVFFemaleFHAdditionalMeasuresId")]
    public int? IvffemaleFhadditionalMeasuresId { get; set; }

    [Column("PIDPolarBodiesIndicationCategoryId")]
    public long? PidpolarBodiesIndicationCategoryId { get; set; }

    [ForeignKey("IvffemaleFhadditionalMeasuresId")]
    [InverseProperty("IvfpidpolarBodiesIndications")]
    public virtual IvfdashboardAdditionalMeasures? IvffemaleFhadditionalMeasures { get; set; }

    [ForeignKey("PidpolarBodiesIndicationCategoryId")]
    [InverseProperty("IvfpidpolarBodiesIndications")]
    public virtual DropdownConfiguration? PidpolarBodiesIndicationCategory { get; set; }
}
