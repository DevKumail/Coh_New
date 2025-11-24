using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFPerformedAdditionalMeasures")]
public partial class IvfperformedAdditionalMeasures
{
    [Key]
    public int PerformedAdditionalMeasuresId { get; set; }

    [Column("IVFAdditionalMeasuresId")]
    public int? IvfadditionalMeasuresId { get; set; }

    public long? PerformedAdditionalMeasuresCategoryId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("IvfadditionalMeasuresId")]
    [InverseProperty("IvfperformedAdditionalMeasures")]
    public virtual IvfdashboardAdditionalMeasures? IvfadditionalMeasures { get; set; }

    [ForeignKey("PerformedAdditionalMeasuresCategoryId")]
    [InverseProperty("IvfperformedAdditionalMeasures")]
    public virtual DropdownConfiguration? PerformedAdditionalMeasuresCategory { get; set; }
}
