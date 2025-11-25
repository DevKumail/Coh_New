using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("RegLastMRNo")]
public partial class RegLastMrno
{
    [Key]
    public int Id { get; set; }

    [Column("LastMRNo")]
    public int LastMrno { get; set; }

    [Column("LastExMRNo")]
    public int? LastExMrno { get; set; }

    [Column("MaxMRNo")]
    public int? MaxMrno { get; set; }

    public bool? Active { get; set; }

    [StringLength(14)]
    public string? ActiveDate { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }
}
