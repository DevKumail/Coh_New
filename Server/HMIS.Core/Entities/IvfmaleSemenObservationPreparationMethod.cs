using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleSemenObservationPreparationMethod")]
public partial class IvfmaleSemenObservationPreparationMethod
{
    [Key]
    public long Id { get; set; }

    public long PreparationId { get; set; }

    public long PreparationMethodId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedAt { get; set; }

    [ForeignKey("PreparationMethodId")]
    [InverseProperty("IvfmaleSemenObservationPreparationMethod")]
    public virtual DropdownConfiguration PreparationMethod { get; set; } = null!;
}
