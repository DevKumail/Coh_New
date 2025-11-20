using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("Table_1")]
public partial class Table1
{
    [Key]
    [Column("IVFFemaleTreatmentSubTypeId")]
    public int IvffemaleTreatmentSubTypeId { get; set; }

    [Column("IVFFemaleTreatmentCycleId")]
    public int? IvffemaleTreatmentCycleId { get; set; }

    [ForeignKey("IvffemaleTreatmentCycleId")]
    [InverseProperty("Table1")]
    public virtual IvffemaleTreatmentCycle? IvffemaleTreatmentCycle { get; set; }
}
