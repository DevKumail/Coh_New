using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFTreatmentTypes")]
public partial class IvftreatmentTypes
{
    [Key]
    [Column("IVFFemaleTreatmentTypeId")]
    public int IvffemaleTreatmentTypeId { get; set; }

    [Column("IVFFemaleTreatmentCycleId")]
    public int? IvffemaleTreatmentCycleId { get; set; }

    public long? TreatmentCategoryId { get; set; }

    [ForeignKey("IvffemaleTreatmentCycleId")]
    [InverseProperty("IvftreatmentTypes")]
    public virtual IvfdashboardTreatmentEpisode? IvffemaleTreatmentCycle { get; set; }

    [ForeignKey("TreatmentCategoryId")]
    [InverseProperty("IvftreatmentTypes")]
    public virtual DropdownConfiguration? TreatmentCategory { get; set; }
}
