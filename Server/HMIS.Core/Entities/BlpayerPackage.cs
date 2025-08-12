using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BLPayerPackage")]
public partial class BlpayerPackage
{
    [Key]
    public long PayerPackageId { get; set; }

    public long? PayerId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? PackageName { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? DisplayName { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? CreatedBy { get; set; }

    public bool? Active { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? ProductName { get; set; }

    [Column("PlanID")]
    [StringLength(10)]
    [Unicode(false)]
    public string? PlanId { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("PayerPackage")]
    public virtual ICollection<InsuredSubscriber> InsuredSubscribers { get; set; } = new List<InsuredSubscriber>();

    [InverseProperty("PayerPackage")]
    public virtual ICollection<Insured> Insureds { get; set; } = new List<Insured>();

    [ForeignKey("PayerId")]
    [InverseProperty("BlpayerPackages")]
    public virtual Blpayer? Payer { get; set; }
}
