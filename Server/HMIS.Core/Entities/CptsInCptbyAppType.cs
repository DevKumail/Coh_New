﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("CPTsInCPTByAppType")]
public partial class CptsInCptbyAppType
{
    [Key]
    public long Id { get; set; }

    [Column("GroupID")]
    public long GroupId { get; set; }

    [Column("CPTCode")]
    [StringLength(11)]
    public string Cptcode { get; set; } = null!;

    [ForeignKey("GroupId")]
    [InverseProperty("CptsInCptbyAppTypes")]
    public virtual CptbyAppType Group { get; set; } = null!;
}
