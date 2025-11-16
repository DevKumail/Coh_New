using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleSemenObservationPreparationType")]
public partial class IvfmaleSemenObservationPreparationType
{
    [Key]
    public int Id { get; set; }

    public int ObservationId { get; set; }

    public long PreparationMethodId { get; set; }
}
