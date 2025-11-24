using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFDashboardAdditionalMeasures")]
public partial class IvfdashboardAdditionalMeasures
{
    [Key]
    [Column("IVFAdditionalMeasuresId")]
    public int IvfadditionalMeasuresId { get; set; }

    [StringLength(50)]
    public string? GeneralCondition { get; set; }

    [InverseProperty("IvfadditionalMeasures")]
    public virtual ICollection<IvfpidembblastIndications> IvfpidembblastIndications { get; set; } = new List<IvfpidembblastIndications>();

    [InverseProperty("IvfadditionalMeasures")]
    public virtual ICollection<IvfpidpolarBodiesIndications> IvfpidpolarBodiesIndications { get; set; } = new List<IvfpidpolarBodiesIndications>();

    [InverseProperty("IvfadditionalMeasures")]
    public virtual ICollection<IvfplannedAdditionalMeasures> IvfplannedAdditionalMeasures { get; set; } = new List<IvfplannedAdditionalMeasures>();
}
