using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class DropdownConfiguration
{
    [Key]
    public long ValueId { get; set; }

    public long CategoryId { get; set; }

    [StringLength(255)]
    public string ValueName { get; set; } = null!;

    public int? SortOrder { get; set; }

    public bool IsActive { get; set; }

    [ForeignKey("CategoryId")]
    [InverseProperty("DropdownConfiguration")]
    public virtual DropdownCategory Category { get; set; } = null!;
}
