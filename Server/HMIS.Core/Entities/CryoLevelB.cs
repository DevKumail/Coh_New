using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("Cryo_LevelB")]
public partial class CryoLevelB
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
    public virtual ICollection<CryoLevelC> CryoLevelC { get; set; } = new List<CryoLevelC>();

    [ForeignKey("LevelAid")]
    [InverseProperty("CryoLevelB")]
    public virtual CryoLevelA LevelA { get; set; } = null!;
}
