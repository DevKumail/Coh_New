using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFEMBBlastIndications")]
public partial class IvfembblastIndications
{
    [Key]
    [Column("PIDEMBBlastIndicationId")]
    public int PidembblastIndicationId { get; set; }

    [Column("IVFAdditionalMeasuresId")]
    public int? IvfadditionalMeasuresId { get; set; }

    [Column("PIDEMBBlastIndicationCategoryId")]
    public long? PidembblastIndicationCategoryId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("IvfadditionalMeasuresId")]
    [InverseProperty("IvfembblastIndications")]
    public virtual IvfdashboardAdditionalMeasures? IvfadditionalMeasures { get; set; }

    [ForeignKey("PidembblastIndicationCategoryId")]
    [InverseProperty("IvfembblastIndications")]
    public virtual DropdownConfiguration? PidembblastIndicationCategory { get; set; }
}
