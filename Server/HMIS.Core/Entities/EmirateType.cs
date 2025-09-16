using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class EmirateType
{
    [Key]
    public long Id { get; set; }

    public string? Code { get; set; }

    public string? Name { get; set; }

    public bool? IsDeleted { get; set; }
}
