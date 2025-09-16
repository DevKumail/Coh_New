using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
public partial class TestTableType
{
    [Column("MRNo")]
    [StringLength(10)]
    [Unicode(false)]
    public string Mrno { get; set; } = null!;

    [Column("id")]
    public int Id { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string? Name { get; set; }

    [Column("isActive")]
    public bool? IsActive { get; set; }

    public bool? IsDeleted { get; set; }
}
