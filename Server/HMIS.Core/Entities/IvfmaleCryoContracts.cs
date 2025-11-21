using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleCryoContracts")]
public partial class IvfmaleCryoContracts
{
    [Key]
    public int CryoContractId { get; set; }

    [StringLength(200)]
    public string ContractName { get; set; } = null!;

    public int? PatientId { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public bool? AutoRenew { get; set; }

    public string? Terms { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("CryoContract")]
    public virtual ICollection<IvfmaleCryoPreservation> IvfmaleCryoPreservation { get; set; } = new List<IvfmaleCryoPreservation>();
}
