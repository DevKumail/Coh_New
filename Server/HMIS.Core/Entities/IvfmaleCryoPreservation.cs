using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleCryoPreservation")]
public partial class IvfmaleCryoPreservation
{
    [Key]
    public int CryoPreservationId { get; set; }

    public int SampleId { get; set; }

    [StringLength(64)]
    public string PreservationCode { get; set; } = null!;

    public DateTime FreezingDateTime { get; set; }

    public int? CryopreservedById { get; set; }

    public long? OriginallyFromClinicId { get; set; }

    public DateTime? StorageDateTime { get; set; }

    public int? StoredById { get; set; }

    public long? MaterialTypeId { get; set; }

    public int? StrawStartNumber { get; set; }

    public int? StrawCount { get; set; }

    public long? StatusId { get; set; }

    public int? CryoContractId { get; set; }

    public bool PreserveUsingCryoStorage { get; set; }

    public long? StoragePlaceId { get; set; }

    [StringLength(50)]
    public string? Position { get; set; }

    public int? ColorId { get; set; }

    public bool ForResearch { get; set; }

    public long? ReasonForResearchId { get; set; }

    public string? Notes { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool? IsDeleted { get; set; }

    [ForeignKey("ColorId")]
    [InverseProperty("IvfmaleCryoPreservation")]
    public virtual IvfstrawColors? Color { get; set; }

    [ForeignKey("CryoContractId")]
    [InverseProperty("IvfmaleCryoPreservation")]
    public virtual IvfmaleCryoContracts? CryoContract { get; set; }

    [InverseProperty("CryoPreservation")]
    public virtual ICollection<IvfmaleCryoStraw> IvfmaleCryoStraw { get; set; } = new List<IvfmaleCryoStraw>();

    [ForeignKey("MaterialTypeId")]
    [InverseProperty("IvfmaleCryoPreservationMaterialType")]
    public virtual DropdownConfiguration? MaterialType { get; set; }

    [ForeignKey("OriginallyFromClinicId")]
    [InverseProperty("IvfmaleCryoPreservationOriginallyFromClinic")]
    public virtual DropdownConfiguration? OriginallyFromClinic { get; set; }

    [ForeignKey("ReasonForResearchId")]
    [InverseProperty("IvfmaleCryoPreservationReasonForResearch")]
    public virtual DropdownConfiguration? ReasonForResearch { get; set; }

    [ForeignKey("SampleId")]
    [InverseProperty("IvfmaleCryoPreservation")]
    public virtual IvfmaleSemenSample Sample { get; set; } = null!;

    [ForeignKey("StatusId")]
    [InverseProperty("IvfmaleCryoPreservationStatus")]
    public virtual DropdownConfiguration? Status { get; set; }

    [ForeignKey("StoragePlaceId")]
    [InverseProperty("IvfmaleCryoPreservation")]
    public virtual IvfcryoLevelC? StoragePlace { get; set; }
}
