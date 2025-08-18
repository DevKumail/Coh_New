using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("StudentInfo")]
public partial class StudentInfo
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    public string StudentName { get; set; } = null!;

    public string FartherName { get; set; } = null!;

    public long AssingmentId { get; set; }

    public long? TeacherNameId { get; set; }

    public long? CourseId { get; set; }

    public long? DaysId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? StartDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? EndDate { get; set; }
}
