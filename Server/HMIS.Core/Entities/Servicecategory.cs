﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("SERVICECATEGORY")]
public partial class Servicecategory
{
    [Key]
    public int ServiceCategoryId { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? Category { get; set; }

    public bool? IsDeleted { get; set; }
}
