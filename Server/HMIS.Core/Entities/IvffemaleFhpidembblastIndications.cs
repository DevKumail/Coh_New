using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFFemaleFHPIDEMBBlastIndications")]
public partial class IvffemaleFhpidembblastIndications
{
    [Key]
    [Column("PIDEMBBlastIndicationId")]
    public int PidembblastIndicationId { get; set; }

    [Column("IVFFemaleFHAdditionalMeasuresId")]
    public int? IvffemaleFhadditionalMeasuresId { get; set; }

    [Column("PIDEMBBlastIndicationCategoryId")]
    public long? PidembblastIndicationCategoryId { get; set; }

    [ForeignKey("IvffemaleFhadditionalMeasuresId")]
    [InverseProperty("IvffemaleFhpidembblastIndications")]
    public virtual IvffemaleFhadditionalMeasures? IvffemaleFhadditionalMeasures { get; set; }

    [ForeignKey("PidembblastIndicationCategoryId")]
    [InverseProperty("IvffemaleFhpidembblastIndications")]
    public virtual DropdownConfiguration? PidembblastIndicationCategory { get; set; }
}
