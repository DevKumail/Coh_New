using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("FamilyProblemList")]
public partial class FamilyProblemList
{
    [Key]
    public long Id { get; set; }

    [StringLength(50)]
    public string? Name { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Descripton { get; set; }

    public long? Code { get; set; }
}
