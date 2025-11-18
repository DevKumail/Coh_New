using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleFHPerformedTreatmentYear")]
public partial class IvfmaleFhperformedTreatmentYear
{
    [Key]
    [Column("IVFMaleFHPerformedTreatmentYearId")]
    public int IvfmaleFhperformedTreatmentYearId { get; set; }

    [Column("IVFMaleFHPerformedTreatmentId")]
    public int IvfmaleFhperformedTreatmentId { get; set; }

    [StringLength(50)]
    public string? TreatmentType { get; set; }

    public int? TreatmentNumber { get; set; }

    [StringLength(40)]
    public string? Year { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("IvfmaleFhperformedTreatmentId")]
    [InverseProperty("IvfmaleFhperformedTreatmentYear")]
    public virtual IvfmaleFhperformedTreatment IvfmaleFhperformedTreatment { get; set; } = null!;
}
