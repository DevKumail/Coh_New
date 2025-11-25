using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFCryoEvents")]
public partial class IvfcryoEvents
{
    [Key]
    public int CryoEventId { get; set; }

    public int? CryoPreservationId { get; set; }

    public int? CryoStrawId { get; set; }

    [StringLength(50)]
    public string EventType { get; set; } = null!;

    public DateTime EventDateTime { get; set; }

    public int? PerformedBy { get; set; }

    [Column("FromStorageLevelCID")]
    public long? FromStorageLevelCid { get; set; }

    [Column("ToStorageLevelCID")]
    public long? ToStorageLevelCid { get; set; }

    public string? Notes { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public int? CreatedBy { get; set; }

    [ForeignKey("FromStorageLevelCid")]
    [InverseProperty("IvfcryoEventsFromStorageLevelC")]
    public virtual IvfcryoLevelC? FromStorageLevelC { get; set; }

    [ForeignKey("ToStorageLevelCid")]
    [InverseProperty("IvfcryoEventsToStorageLevelC")]
    public virtual IvfcryoLevelC? ToStorageLevelC { get; set; }
}
