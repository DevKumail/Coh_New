using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFStrawColors")]
public partial class IvfstrawColors
{
    [Key]
    public int ColorId { get; set; }

    [StringLength(7)]
    public string ColorCode { get; set; } = null!;

    [StringLength(255)]
    public string? ColorDescription { get; set; }

    public int? SortOrder { get; set; }

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("Color")]
    public virtual ICollection<IvfmaleCryoPreservation> IvfmaleCryoPreservation { get; set; } = new List<IvfmaleCryoPreservation>();

    [InverseProperty("Color")]
    public virtual ICollection<IvfmaleCryoStraw> IvfmaleCryoStraw { get; set; } = new List<IvfmaleCryoStraw>();
}
