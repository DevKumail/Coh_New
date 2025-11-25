using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class DeductiblePercent
{
    [Key]
    [Column("DeductibleID")]
    public long DeductibleId { get; set; }

    public long SubscriberId { get; set; }

    public int ServiceType { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Deductible { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [ForeignKey("SubscriberId")]
    [InverseProperty("DeductiblePercent")]
    public virtual InsuredSubscriber Subscriber { get; set; } = null!;
}
