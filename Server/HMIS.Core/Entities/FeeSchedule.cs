using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("FeeSchedule")]
public partial class FeeSchedule
{
    [Key]
    public byte Id { get; set; }

    public string? Name { get; set; }

    public bool? IsDeleted { get; set; }
}
