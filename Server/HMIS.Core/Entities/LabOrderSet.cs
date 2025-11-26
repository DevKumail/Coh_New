using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class LabOrderSet
{
    [Key]
    public int LabOrderSetId { get; set; }

    [Column("MRNo")]
    public long? Mrno { get; set; }

    public int? ProviderId { get; set; }

    public long? AppId { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? OrderDate { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? VisitAccountNo { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? CreatedBy { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? CreatedDate { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? UpdatedBy { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? UpdatedDate { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string? OrderControlCode { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string? OrderStatus { get; set; }

    [Column("IsHL7MsgCreated")]
    public bool? IsHl7msgCreated { get; set; }

    public int? OrderSetId { get; set; }

    [Column("IsHL7MessageGeneratedForPhilips")]
    public bool? IsHl7messageGeneratedForPhilips { get; set; }

    public bool? IsSigned { get; set; }

    [Column("oldMRNo")]
    [StringLength(50)]
    [Unicode(false)]
    public string? OldMrno { get; set; }

    [Column("HL7MessageId")]
    public int? Hl7messageId { get; set; }

    public long? OrderNumber { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [ForeignKey("AppId")]
    [InverseProperty("LabOrderSet")]
    public virtual SchAppointment? App { get; set; }
}
