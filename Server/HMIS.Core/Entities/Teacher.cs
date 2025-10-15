using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class Teacher
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("Teacher Name")]
    [StringLength(50)]
    [Unicode(false)]
    public string? TeacherName { get; set; }
}
