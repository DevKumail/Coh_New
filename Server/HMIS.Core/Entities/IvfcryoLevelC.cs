using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFCryoLevelC")]
public partial class IvfcryoLevelC
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

    [InverseProperty("StoragePlace")]
    public virtual ICollection<IvfmaleCryoPreservation> IvfmaleCryoPreservation { get; set; } = new List<IvfmaleCryoPreservation>();

    [InverseProperty("StorageLevelC")]
    public virtual ICollection<IvfmaleCryoStraw> IvfmaleCryoStraw { get; set; } = new List<IvfmaleCryoStraw>();

    [ForeignKey("LevelBid")]
    [InverseProperty("IvfcryoLevelC")]
    public virtual IvfcryoLevelB LevelB { get; set; } = null!;
}
