using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("Task")]
public partial class Task
{
    [Key]
    public int TaskId { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string Subject { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime TaskStartDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime TaskDueDate { get; set; }

    public int CategoryId { get; set; }

    [StringLength(6)]
    [Unicode(false)]
    public string Priority { get; set; } = null!;

    [Column("MRNo")]
    [StringLength(10)]
    [Unicode(false)]
    public string? Mrno { get; set; }

    public int? VisitAccNo { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string? TaskType { get; set; }

    [Column("RecordIDFK")]
    [StringLength(50)]
    [Unicode(false)]
    public string? RecordIdfk { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedOn { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? UpdatedBy { get; set; }

    public bool? IsDeleted { get; set; }
}
