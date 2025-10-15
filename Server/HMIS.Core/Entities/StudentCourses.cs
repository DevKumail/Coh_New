using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("Student_courses")]
public partial class StudentCourses
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Courses { get; set; }
}
