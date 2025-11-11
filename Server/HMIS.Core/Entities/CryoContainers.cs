using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("Cryo_Containers")]
public partial class CryoContainers
{
    [Key]
    [Column("ID")]
    public long Id { get; set; }

    [Column("FacilityID")]
    public long FacilityId { get; set; }

    [StringLength(50)]
    public string Description { get; set; } = null!;

    [StringLength(50)]
    public string Type { get; set; } = null!;

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

    [InverseProperty("Container")]
    public virtual ICollection<CryoLevelA> CryoLevelA { get; set; } = new List<CryoLevelA>();
}
