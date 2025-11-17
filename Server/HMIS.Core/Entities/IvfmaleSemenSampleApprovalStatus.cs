using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleSemenSampleApprovalStatus")]
public partial class IvfmaleSemenSampleApprovalStatus
{
    [Key]
    public int ApprovalStatusId { get; set; }

    public int SampleId { get; set; }

    public bool IsApproved { get; set; }

    public bool IsAttention { get; set; }

    public long? AttentionForId { get; set; }

    public string? Comment { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedAt { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedAt { get; set; }

    [ForeignKey("SampleId")]
    [InverseProperty("IvfmaleSemenSampleApprovalStatus")]
    public virtual IvfmaleSemenSample Sample { get; set; } = null!;
}
