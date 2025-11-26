using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Index("ObjectName", Name = "UQ__CacheInf__5B8F1484D0CE0499", IsUnique = true)]
public partial class CacheInfo
{
    [Key]
    public int Id { get; set; }

    [StringLength(40)]
    [Unicode(false)]
    public string? ObjectName { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? ObjectType { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? OrderbyColumn { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? OrderbyDirection { get; set; }

    [Unicode(false)]
    public string? Columns { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedOn { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? UpdatedBy { get; set; }

    public int? IsActive { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
