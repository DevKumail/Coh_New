using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class LabTests
{
    [StringLength(500)]
    public string? LabName { get; set; }

    public long? ParentId { get; set; }

    public float? MinValue { get; set; }

    public float? MaxValue { get; set; }

    [StringLength(255)]
    public string? LabUnit { get; set; }

    public bool? Active { get; set; }

    [Column("CPTCode")]
    [StringLength(255)]
    public string? Cptcode { get; set; }

    [StringLength(255)]
    public string? LabAbreviation { get; set; }

    [Column(TypeName = "money")]
    public decimal? UnitPrice { get; set; }

    public int? IsRadiologyTest { get; set; }

    public bool? IsInternalTest { get; set; }

    [Key]
    public long LabTestId { get; set; }

    public long? NodeIdentifier { get; set; }

    public Guid? ItemId { get; set; }

    public Guid? AccountId { get; set; }

    public bool? IsProfile { get; set; }

    public int? BillOnOrder { get; set; }

    public Guid? LaboratoryId { get; set; }

    [Column("InvestigationTypeID")]
    public int? InvestigationTypeId { get; set; }

    public long? WeqayaId { get; set; }

    public int? ActivityStartAddMinutes { get; set; }

    public bool? BloodSampleRequired { get; set; }

    public bool? IsHidden { get; set; }

    public bool? DisableSelection { get; set; }

    public bool? IsDeleted { get; set; }
}
