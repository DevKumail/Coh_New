using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class RegLocations
{
    [Key]
    public int LocationId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string Name { get; set; } = null!;

    public int? TypeId { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Description { get; set; }

    public int? ParentLocationId { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? LocationType { get; set; }

    public bool? Active { get; set; }

    [Column("InvestigationTypeID")]
    public int? InvestigationTypeId { get; set; }

    public int? DefaultClassificationId { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("Location")]
    public virtual ICollection<RegPatientDetails> RegPatientDetails { get; set; } = new List<RegPatientDetails>();
}
