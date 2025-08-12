using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class SchBlockTimeslot
{
    [Key]
    [Column("BTSId")]
    public long Btsid { get; set; }

    public long ProviderId { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string Reason { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime? EffectiveDateTime { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string EnteredBy { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime? EntryDateTime { get; set; }

    public long? SiteId { get; set; }

    public bool? IsDeleted { get; set; }
}
