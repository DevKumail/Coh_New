using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleSemenMotility")]
public partial class IvfmaleSemenMotility
{
    [Key]
    public int MotilityId { get; set; }

    public int ObservationId { get; set; }

    [Column("WHO_AB_Percent", TypeName = "decimal(5, 2)")]
    public decimal? WhoAbPercent { get; set; }

    [Column("WHO_C_Percent", TypeName = "decimal(5, 2)")]
    public decimal? WhoCPercent { get; set; }

    [Column("WHO_D_Percent", TypeName = "decimal(5, 2)")]
    public decimal? WhoDPercent { get; set; }

    public int? ProgressiveMotile { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? OverallMotilityPercent { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedAt { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedAt { get; set; }
}
