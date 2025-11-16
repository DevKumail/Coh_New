using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class DropdownCategory
{
    [Key]
    public long CategoryId { get; set; }

    [StringLength(255)]
    public string CategoryName { get; set; } = null!;

    [StringLength(1000)]
    public string? Description { get; set; }

    [InverseProperty("Category")]
    public virtual ICollection<DropdownConfiguration> DropdownConfiguration { get; set; } = new List<DropdownConfiguration>();

    [InverseProperty("Category")]
    public virtual ICollection<IvfmaleFhgeneral> IvfmaleFhgeneral { get; set; } = new List<IvfmaleFhgeneral>();
}
