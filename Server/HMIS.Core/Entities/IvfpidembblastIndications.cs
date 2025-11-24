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

    [Column("IVFAdditionalMeasuresId")]
    public int? IvfadditionalMeasuresId { get; set; }

    [Column("PIDEMBBlastIndicationCategoryId")]
    public long? PidembblastIndicationCategoryId { get; set; }

    [ForeignKey("IvfadditionalMeasuresId")]
    [InverseProperty("IvfpidembblastIndications")]
    public virtual IvfdashboardAdditionalMeasures? IvfadditionalMeasures { get; set; }

    [ForeignKey("PidembblastIndicationCategoryId")]
    [InverseProperty("IvfpidembblastIndications")]
    public virtual DropdownConfiguration? PidembblastIndicationCategory { get; set; }
}
