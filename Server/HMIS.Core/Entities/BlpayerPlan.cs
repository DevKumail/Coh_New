using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BLPayerPlan")]
public partial class BlpayerPlan
{
    [Column("PlanID")]
    [StringLength(10)]
    [Unicode(false)]
    public string PlanId { get; set; } = null!;

    public long PayerId { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string PlanName { get; set; } = null!;

    public bool Active { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    [Key]
    [Column("ID")]
    public long Id { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? ReceiverId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? ClaimPayerId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? ReceiverIdDubai { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? ClaimPayerIdDubai { get; set; }

    [StringLength(50)]
    public string? Network { get; set; }

    [Column("ELMappingID")]
    [StringLength(10)]
    [Unicode(false)]
    public string? ElmappingId { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("Plan")]
    public virtual ICollection<EligibilityLog> EligibilityLog { get; set; } = new List<EligibilityLog>();

    [ForeignKey("PayerId")]
    [InverseProperty("BlpayerPlan")]
    public virtual Blpayer Payer { get; set; } = null!;

    [InverseProperty("Plan")]
    public virtual ICollection<SchAppointment> SchAppointment { get; set; } = new List<SchAppointment>();
}
