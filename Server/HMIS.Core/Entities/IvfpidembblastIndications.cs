using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFPIDEMBBlastIndications")]
public partial class IvfpidembblastIndications
{
    [Key]
    [Column("PIDEMBBlastIndicationId")]
    public int PidembblastIndicationId { get; set; }

    [Column("IVFFemaleFHAdditionalMeasuresId")]
    public int? IvffemaleFhadditionalMeasuresId { get; set; }

    [Column("PIDEMBBlastIndicationCategoryId")]
    public long? PidembblastIndicationCategoryId { get; set; }

    [ForeignKey("IvffemaleFhadditionalMeasuresId")]
    [InverseProperty("IvfpidembblastIndications")]
    public virtual IvfdashboardAdditionalMeasures? IvffemaleFhadditionalMeasures { get; set; }

    [ForeignKey("PidembblastIndicationCategoryId")]
    [InverseProperty("IvfpidembblastIndications")]
    public virtual DropdownConfiguration? PidembblastIndicationCategory { get; set; }
}
