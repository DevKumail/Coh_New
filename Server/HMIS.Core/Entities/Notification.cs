using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class Notification
{
    [Key]
    public long NotificationId { get; set; }

    [MaxLength(50)]
    public byte[]? NotificationTitle { get; set; }

    [MaxLength(50)]
    public byte[]? NotificationType { get; set; }

    public int? RecordId { get; set; }

    public int? SenderId { get; set; }

    public int? ReceiverId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? SenderDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ReceiverDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ViewDate { get; set; }
}
