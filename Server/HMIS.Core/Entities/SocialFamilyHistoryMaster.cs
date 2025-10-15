﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
public partial class SocialFamilyHistoryMaster
{
    [Column("SHID")]
    public long Shid { get; set; }

    [Column("SHName")]
    [StringLength(50)]
    public string Shname { get; set; } = null!;

    public bool? Active { get; set; }

    [StringLength(50)]
    public string? ObservationCode { get; set; }
}
