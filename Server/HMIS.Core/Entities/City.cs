﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class City
{
    [Key]
    public int Id { get; set; }

    [StringLength(100)]
    public string CityName { get; set; } = null!;
}
