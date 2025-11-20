using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFCryoLevelB")]
public partial class IvfcryoLevelB
{
    [Key]
    [Column("ID")]
    public long Id { get; set; }

    [Column("LevelAID")]
    public long LevelAid { get; set; }

    [StringLength(10)]
    public string CaneCode { get; set; } = null!;

    public long? CreatedBy { get; set; }

    public long? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedAt { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }

    [InverseProperty("LevelB")]
    public virtual ICollection<IvfcryoLevelC> IvfcryoLevelC { get; set; } = new List<IvfcryoLevelC>();

    [ForeignKey("LevelAid")]
    [InverseProperty("IvfcryoLevelB")]
    public virtual IvfcryoLevelA LevelA { get; set; } = null!;
}
