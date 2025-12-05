using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
[Table("IVFEpisodePregnancy")]
public partial class IvfepisodePregnancy
{
    public long Id { get; set; }

    public long? CycleOutcomeCategoryId { get; set; }

    [Column("PositivePGTestCategoryId")]
    public long? PositivePgtestCategoryId { get; set; }

    [Column("LasthCGDate")]
    public DateTime? LasthCgdate { get; set; }
}
