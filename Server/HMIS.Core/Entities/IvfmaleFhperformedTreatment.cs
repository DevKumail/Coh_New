using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleFHPerformedTreatment")]
public partial class IvfmaleFhperformedTreatment
{
    [Key]
    [Column("IVFMaleFHPerformedTreatmentId")]
    public int IvfmaleFhperformedTreatmentId { get; set; }

    [Column("IVFMaleFHGeneralId")]
    public int IvfmaleFhgeneralId { get; set; }

    public bool? AlreadyTreated { get; set; }

    [StringLength(300)]
    public string? Notes { get; set; }

    [ForeignKey("IvfmaleFhgeneralId")]
    [InverseProperty("IvfmaleFhperformedTreatment")]
    public virtual IvfmaleFhgeneral IvfmaleFhgeneral { get; set; } = null!;

    [InverseProperty("IvfmaleFhperformedTreatment")]
    public virtual ICollection<IvfmaleFhperformedTreatmentYear> IvfmaleFhperformedTreatmentYear { get; set; } = new List<IvfmaleFhperformedTreatmentYear>();
}
