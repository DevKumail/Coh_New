using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFCryoLevelA")]
public partial class IvfcryoLevelA
{
    [Key]
    [Column("ID")]
    public long Id { get; set; }

    [Column("ContainerID")]
    public long ContainerId { get; set; }

    [StringLength(10)]
    public string CanisterCode { get; set; } = null!;

    public long? CreatedBy { get; set; }

    public long? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedAt { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("ContainerId")]
    [InverseProperty("IvfcryoLevelA")]
    public virtual IvfcryoContainers Container { get; set; } = null!;

    [InverseProperty("LevelA")]
    public virtual ICollection<IvfcryoLevelB> IvfcryoLevelB { get; set; } = new List<IvfcryoLevelB>();
}
