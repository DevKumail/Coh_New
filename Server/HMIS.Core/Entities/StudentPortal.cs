using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("Student_Portal")]
public partial class StudentPortal
{
    [Key]
    [Column("Student_days_id")]
    public long StudentDaysId { get; set; }

    [Column("Student_Days")]
    [StringLength(50)]
    [Unicode(false)]
    public string? StudentDays { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }
}
