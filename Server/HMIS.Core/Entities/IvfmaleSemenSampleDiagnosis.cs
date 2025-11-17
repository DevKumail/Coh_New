using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleSemenSampleDiagnosis")]
public partial class IvfmaleSemenSampleDiagnosis
{
    [Key]
    public int DiagnosisId { get; set; }

    public int SampleId { get; set; }

    [Column("ICDCodeId")]
    public int IcdcodeId { get; set; }

    [StringLength(50)]
    public string Finding { get; set; } = null!;

    public string? Notes { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
