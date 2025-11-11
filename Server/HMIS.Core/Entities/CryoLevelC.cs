using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("Cryo_LevelC")]
public partial class CryoLevelC
{
    [Key]
    [Column("ID")]
    public long Id { get; set; }

    [Column("LevelBID")]
    public long LevelBid { get; set; }

    public int StrawPosition { get; set; }

    [Column("SampleID")]
    public long? SampleId { get; set; }

    [StringLength(50)]
    public string Status { get; set; } = null!;

    public long? CreatedBy { get; set; }

    public long? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedAt { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("LevelBid")]
    [InverseProperty("CryoLevelC")]
    public virtual CryoLevelB LevelB { get; set; } = null!;
}
