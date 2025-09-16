﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class RegGenderIdentity
{
    [Key]
    public long GenderId { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? GenderText { get; set; }

    public bool Active { get; set; }
}
