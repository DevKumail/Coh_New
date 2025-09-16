using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class Assingment
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("Assingment")]
    [StringLength(50)]
    public string? Assingment1 { get; set; }
}
