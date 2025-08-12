using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("OrderReferral")]
public partial class OrderReferral
{
    [Key]
    public long OrderReferralId { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Subject { get; set; }

    [Column("ReferredToID")]
    public long? ReferredToId { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? ReferredToName { get; set; }

    public int? Speciality { get; set; }

    [Column(TypeName = "ntext")]
    public string? ProviderNotes { get; set; }

    public long? VisitAccNo { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string? Instructions { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? OrderStatus { get; set; }

    [Column("ReferredByID")]
    public long? ReferredById { get; set; }

    [Column("CreatedByID")]
    public long CreatedById { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    [Column("UpdatedByID")]
    public long? UpdatedById { get; set; }

    public bool IsComplete { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? CancelReason { get; set; }

    [Column("NoteID")]
    public long? NoteId { get; set; }

    public bool? IsInternal { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? AwaitingReason { get; set; }

    public int? SenderSpeciality { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string? Mrno { get; set; }

    public int? FacilityTo { get; set; }

    public long? RefAppId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? EmailNotificationTime { get; set; }

    [Column("UEMSReferralID")]
    public long? UemsreferralId { get; set; }

    [Column("UEMSReferralInsertTime", TypeName = "datetime")]
    public DateTime? UemsreferralInsertTime { get; set; }

    public bool? IsDeleted { get; set; }
}
