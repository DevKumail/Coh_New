using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class TaskForwarding
{
    [Key]
    [Column("TFId")]
    public int Tfid { get; set; }

    public int TaskId { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string Status { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime TaskForwardingDate { get; set; }

    public int SenderId { get; set; }

    public int ReceiverId { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string? SenderComment { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ReceiverUpdateDate { get; set; }

    public int ReceiverRoleId { get; set; }

    public bool? IsHidden { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedOn { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? UpdatedBy { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [ForeignKey("ReceiverRoleId")]
    [InverseProperty("TaskForwarding")]
    public virtual SecRole ReceiverRole { get; set; } = null!;
}
