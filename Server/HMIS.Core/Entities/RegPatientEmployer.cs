using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class RegPatientEmployer
{
    [Key]
    public int PatientEmployerId { get; set; }

    [Column("MRNO")]
    [StringLength(10)]
    [Unicode(false)]
    public string? Mrno { get; set; }

    public int? EmploymentTypeId { get; set; }

    public int? EmploymentStatusId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? EmploymentCompanyName { get; set; }

    public long? PatientId { get; set; }

    public byte? EmploymentOccupationId { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [ForeignKey("EmploymentOccupationId")]
    [InverseProperty("RegPatientEmployer")]
    public virtual RegOccupation? EmploymentOccupation { get; set; }

    [ForeignKey("EmploymentTypeId")]
    [InverseProperty("RegPatientEmployer")]
    public virtual RegEmploymentType? EmploymentType { get; set; }

    [ForeignKey("PatientId")]
    [InverseProperty("RegPatientEmployer")]
    public virtual RegPatient? Patient { get; set; }
}
