using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class LabResultsMain
{
    [Key]
    public int LabResultId { get; set; }

    public long? OrderSetDetailId { get; set; }

    [Column("MRNo")]
    [StringLength(10)]
    [Unicode(false)]
    public string Mrno { get; set; } = null!;

    public long? ProviderId { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string TestName { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string TestNameAbbreviation { get; set; } = null!;

    [Column("CPTCode")]
    [StringLength(22)]
    public string? Cptcode { get; set; }

    public int? CreatedBy { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string CreatedDate { get; set; } = null!;

    public int? UpdatedBy { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string UpdatedDate { get; set; } = null!;

    [StringLength(100)]
    public string? ReviewedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ReviewedDate { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? AccessionNumber { get; set; }

    public bool? IsDefault { get; set; }

    public long? PrincipalResultInterpreter { get; set; }

    [StringLength(500)]
    public string? Action { get; set; }

    [Column("oldMRNo")]
    [StringLength(20)]
    [Unicode(false)]
    public string? OldMrno { get; set; }

    public int? SequenceNo { get; set; }

    public int? PerformAtLabId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? Note { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? PerformDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? EntryDate { get; set; }

    [InverseProperty("LabResult")]
    public virtual ICollection<LabResultsScannedImages> LabResultsScannedImages { get; set; } = new List<LabResultsScannedImages>();
}
