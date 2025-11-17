using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleSemenObservationPreparation")]
public partial class IvfmaleSemenObservationPreparation
{
    [Key]
    public int PreparationId { get; set; }

    public int ObservationId { get; set; }

    public DateOnly PreparationDate { get; set; }

    public TimeOnly PreparationTime { get; set; }

    public int? PreparedById { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedAt { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedAt { get; set; }
}
