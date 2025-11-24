using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFPolarBodiesIndications")]
public partial class IvfpolarBodiesIndications
{
    [Key]
    [Column("PIDPolarBodiesIndicationId")]
    public int PidpolarBodiesIndicationId { get; set; }

    [Column("IVFAdditionalMeasuresId")]
    public int? IvfadditionalMeasuresId { get; set; }

    [Column("PIDPolarBodiesIndicationCategoryId")]
    public long? PidpolarBodiesIndicationCategoryId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("IvfadditionalMeasuresId")]
    [InverseProperty("IvfpolarBodiesIndications")]
    public virtual IvfdashboardAdditionalMeasures? IvfadditionalMeasures { get; set; }

    [ForeignKey("PidpolarBodiesIndicationCategoryId")]
    [InverseProperty("IvfpolarBodiesIndications")]
    public virtual DropdownConfiguration? PidpolarBodiesIndicationCategory { get; set; }
}
