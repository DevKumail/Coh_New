using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
[Table("AvailableMRNo")]
public partial class AvailableMrno
{
    [Column("MRNo")]
    [StringLength(10)]
    [Unicode(false)]
    public string Mrno { get; set; } = null!;

    [StringLength(25)]
    [Unicode(false)]
    public string DeletedBy { get; set; } = null!;

    [StringLength(14)]
    [Unicode(false)]
    public string DeletedDate { get; set; } = null!;

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }
}
