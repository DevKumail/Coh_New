using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFFemaleTreatmentCycle")]
public partial class IvffemaleTreatmentCycle
{
    [Key]
    [Column("IVFFemaleTreatmentCycleId")]
    public int IvffemaleTreatmentCycleId { get; set; }

    public long? TreatmentTypeCategoryId { get; set; }

    [InverseProperty("IvffemaleTreatmentCycle")]
    public virtual ICollection<Table1> Table1 { get; set; } = new List<Table1>();

    [ForeignKey("TreatmentTypeCategoryId")]
    [InverseProperty("IvffemaleTreatmentCycle")]
    public virtual DropdownConfiguration? TreatmentTypeCategory { get; set; }
}
