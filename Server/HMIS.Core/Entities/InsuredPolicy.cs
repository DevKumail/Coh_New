using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class InsuredPolicy
{
    [Key]
    public int InsuredPolicyId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? EffectiveDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? TerminationDate { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? GroupNo { get; set; }

    public int? NoOfVisits { get; set; }

    public bool? Status { get; set; }

    public long? SubscriberId { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Amount { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("SubscriberId")]
    [InverseProperty("InsuredPolicy")]
    public virtual InsuredSubscriber? Subscriber { get; set; }
}
