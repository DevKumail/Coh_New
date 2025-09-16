﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class ImmunizationList
{
    [StringLength(50)]
    public string ImmTypeName { get; set; } = null!;

    [StringLength(250)]
    public string? Description { get; set; }

    public bool Active { get; set; }

    [Key]
    public long ImmTypeId { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("DrugType")]
    public virtual ICollection<PatientImmunization> PatientImmunizationDrugType { get; set; } = new List<PatientImmunization>();

    [InverseProperty("ImmType")]
    public virtual ICollection<PatientImmunization> PatientImmunizationImmType { get; set; } = new List<PatientImmunization>();
}
