using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFPlannedAdditionalMeasures")]
public partial class IvfplannedAdditionalMeasures
{
    [Key]
    public int AdditionalMeasuresId { get; set; }

    [Column("IVFAdditionalMeasuresId")]
    public int? IvfadditionalMeasuresId { get; set; }

    public long? MeasuresCategoryId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("IvfadditionalMeasuresId")]
    [InverseProperty("IvfplannedAdditionalMeasures")]
    public virtual IvfdashboardAdditionalMeasures? IvfadditionalMeasures { get; set; }

    [ForeignKey("MeasuresCategoryId")]
    [InverseProperty("IvfplannedAdditionalMeasures")]
    public virtual DropdownConfiguration? MeasuresCategory { get; set; }
}
