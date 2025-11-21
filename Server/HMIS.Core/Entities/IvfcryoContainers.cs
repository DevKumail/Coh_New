using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFCryoContainers")]
public partial class IvfcryoContainers
{
    [Key]
    [Column("ID")]
    public long Id { get; set; }

    [Column("FacilityID")]
    public long FacilityId { get; set; }

    [StringLength(50)]
    public string Description { get; set; } = null!;

    [StringLength(100)]
    public string? LastAudit { get; set; }

    public int? MaxStrawsInLastLevel { get; set; }

    public long? CreatedBy { get; set; }

    public long? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedAt { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime UpdatedAt { get; set; }

    public bool IsDeleted { get; set; }

    public bool? IsSperm { get; set; }

    public bool? IsOocyteOrEmbryo { get; set; }

    [InverseProperty("Container")]
    public virtual ICollection<IvfcryoLevelA> IvfcryoLevelA { get; set; } = new List<IvfcryoLevelA>();
}
