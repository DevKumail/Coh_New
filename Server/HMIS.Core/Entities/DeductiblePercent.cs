using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("DeductiblePercent")]
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

    [ForeignKey("SubscriberId")]
    [InverseProperty("DeductiblePercents")]
    public virtual InsuredSubscriber Subscriber { get; set; } = null!;
}
