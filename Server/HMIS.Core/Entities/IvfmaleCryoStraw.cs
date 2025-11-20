using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleCryoStraw")]
public partial class IvfmaleCryoStraw
{
    [Key]
    public int CryoStrawId { get; set; }

    public int CryoPreservationId { get; set; }

    public int SampleId { get; set; }

    public int StrawNumber { get; set; }

    [StringLength(100)]
    public string? StrawLabel { get; set; }

    public long? MaterialTypeId { get; set; }

    public int? ColorId { get; set; }

    [StringLength(50)]
    public string Status { get; set; } = null!;

    [Column("StorageLevelCID")]
    public long? StorageLevelCid { get; set; }

    public DateTime? PlacedAt { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool? IsDeleted { get; set; }

    [ForeignKey("ColorId")]
    [InverseProperty("IvfmaleCryoStraw")]
    public virtual IvfstrawColors? Color { get; set; }

    [ForeignKey("CryoPreservationId")]
    [InverseProperty("IvfmaleCryoStraw")]
    public virtual IvfmaleCryoPreservation CryoPreservation { get; set; } = null!;

    [ForeignKey("MaterialTypeId")]
    [InverseProperty("IvfmaleCryoStraw")]
    public virtual DropdownConfiguration? MaterialType { get; set; }

    [ForeignKey("SampleId")]
    [InverseProperty("IvfmaleCryoStraw")]
    public virtual IvfmaleSemenSample Sample { get; set; } = null!;

    [ForeignKey("StorageLevelCid")]
    [InverseProperty("IvfmaleCryoStraw")]
    public virtual IvfcryoLevelC? StorageLevelC { get; set; }
}
