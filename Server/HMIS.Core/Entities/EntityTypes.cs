using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class EntityTypes
{
    [Key]
    public byte Id { get; set; }

    [StringLength(50)]
    public string? Code { get; set; }

    public string? Name { get; set; }

    public bool? IsDeleted { get; set; }
}
