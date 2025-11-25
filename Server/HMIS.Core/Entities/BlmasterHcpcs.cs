using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BLMasterHCPCS")]
public partial class BlmasterHcpcs
{
    [Key]
    [Column("HCPCSCode")]
    [StringLength(11)]
    public string Hcpcscode { get; set; } = null!;

    [StringLength(35)]
    public string? DescriptionShort { get; set; }

    [StringLength(48)]
    public string? DescriptionLong { get; set; }

    [Column(TypeName = "ntext")]
    public string? DescriptionFull { get; set; }

    [StringLength(1)]
    public string? Status { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Price { get; set; }

    public bool? IsUnlisted { get; set; }

    [Column("VATpercentage", TypeName = "decimal(18, 2)")]
    public decimal? Vatpercentage { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [InverseProperty("HcpcscodeNavigation")]
    public virtual ICollection<BlhcpcsgroupCode> BlhcpcsgroupCode { get; set; } = new List<BlhcpcsgroupCode>();
}
