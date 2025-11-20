using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFFemaleTreatmentTypes")]
public partial class IvffemaleTreatmentTypes
{
    [Key]
    [Column("IVFFemaleTreatmentTypeId")]
    public int IvffemaleTreatmentTypeId { get; set; }

    [Column("IVFFemaleTreatmentCycleId")]
    public int? IvffemaleTreatmentCycleId { get; set; }

    public long? TreatmentCategoryId { get; set; }

    [ForeignKey("IvffemaleTreatmentCycleId")]
    [InverseProperty("IvffemaleTreatmentTypes")]
    public virtual IvffemaleTreatmentCycle? IvffemaleTreatmentCycle { get; set; }

    [ForeignKey("TreatmentCategoryId")]
    [InverseProperty("IvffemaleTreatmentTypes")]
    public virtual DropdownConfiguration? TreatmentCategory { get; set; }
}
