using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleSemenSampleDiagnosisICDType")]
public partial class IvfmaleSemenSampleDiagnosisIcdtype
{
    [Key]
    [Column("DiagnosisICDId")]
    public int DiagnosisIcdid { get; set; }

    public int DiagnosisId { get; set; }

    [Column("ICDCode")]
    [StringLength(100)]
    public string? Icdcode { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [ForeignKey("DiagnosisId")]
    [InverseProperty("IvfmaleSemenSampleDiagnosisIcdtype")]
    public virtual IvfmaleSemenSampleDiagnosis Diagnosis { get; set; } = null!;

    [InverseProperty("DiagnosisIcd")]
    public virtual ICollection<IvfmaleSemenSampleDiagnosis> IvfmaleSemenSampleDiagnosis { get; set; } = new List<IvfmaleSemenSampleDiagnosis>();
}
