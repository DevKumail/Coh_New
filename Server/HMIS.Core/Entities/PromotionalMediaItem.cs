using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class PromotionalMediaItem
{
    [Key]
    [Column("MediaItemID")]
    public long MediaItemId { get; set; }

    public long MediaChannelId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string Name { get; set; } = null!;

    [StringLength(200)]
    [Unicode(false)]
    public string? Description { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string CreateDate { get; set; } = null!;

    public bool Active { get; set; }

    public bool? IsDeleted { get; set; }
}
