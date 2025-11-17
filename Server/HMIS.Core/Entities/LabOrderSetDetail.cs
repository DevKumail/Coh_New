using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class LabOrderSetDetail
{
    public long OrderSetId { get; set; }

    public long LabTestId { get; set; }

    [Column("CPTCode")]
    [StringLength(11)]
    public string? Cptcode { get; set; }

    [Column("PComments", TypeName = "ntext")]
    public string? Pcomments { get; set; }

    public int OrderQuantity { get; set; }

    public Guid? SendToLabId { get; set; }

    [Key]
    public long OrderSetDetailId { get; set; }

    /// <summary>
    /// 2 = Pathalogy
    /// 1 = Lab
    /// 0 = Radiology
    /// </summary>
    public int? IsRadiologyTest { get; set; }

    public bool? IsInternalTest { get; set; }

    [StringLength(50)]
    public string? RadiologySide { get; set; }

    [Column("ProfileLabTestID")]
    public long? ProfileLabTestId { get; set; }

    public long? VisitOrderNo { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string? ResultExpectedDate { get; set; }

    [StringLength(100)]
    public string? ReferralName { get; set; }

    public long? ReferralId { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string? SignedDate { get; set; }

    [StringLength(50)]
    public string? ReferralTo { get; set; }

    [StringLength(200)]
    public string? CancelComments { get; set; }

    public int? InvestigationTypeId { get; set; }

    public long? OldOrderDetailId { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string? RescheduledTo { get; set; }

    public int? BillOnOrder { get; set; }

    public bool? IsDeleted { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CollectDate { get; set; }

    [StringLength(50)]
    public string? Status { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? PerformDate { get; set; }

    public int? SampleTypeId { get; set; }
}
