using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
[Table("IVFMaleFHIllnessIdiopathic")]
public partial class IvfmaleFhillnessIdiopathic
{
    [Column("IVFMaleFHIllnessId")]
    public int IvfmaleFhillnessId { get; set; }

    [Column("IVFMaleFHIdiopathicId")]
    public long IvfmaleFhidiopathicId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("IvfmaleFhidiopathicId")]
    public virtual DropdownConfiguration IvfmaleFhidiopathic { get; set; } = null!;

    [ForeignKey("IvfmaleFhillnessId")]
    public virtual IvfmaleFhillness IvfmaleFhillness { get; set; } = null!;
}
