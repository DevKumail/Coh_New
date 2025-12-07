using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class LabResultsScannedImages
{
    [Key]
    public int LabImageId { get; set; }

    public int LabResultId { get; set; }

    public long? FileId { get; set; }

    public int? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("FileId")]
    [InverseProperty("LabResultsScannedImages")]
    public virtual HmisFiles? File { get; set; }

    [ForeignKey("LabResultId")]
    [InverseProperty("LabResultsScannedImages")]
    public virtual LabResultsMain LabResult { get; set; } = null!;
}
