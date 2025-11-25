using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class RegAssignments
{
    [Key]
    public long AssId { get; set; }

    [Column("MRNo")]
    [StringLength(10)]
    [Unicode(false)]
    public string Mrno { get; set; } = null!;

    public int? ProviderId { get; set; }

    public int? DepartmentId { get; set; }

    public byte? FeeScheduleId { get; set; }

    public byte? FinancialClassId { get; set; }

    public int? LocationId { get; set; }

    public int? RefferingProviderId { get; set; }

    public byte? RefferalTypeId { get; set; }

    public bool? Active { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? ProofOfIncome { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? ReferringProviderName { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }
}
