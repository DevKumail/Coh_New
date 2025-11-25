using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[PrimaryKey("GroupCodeId", "GroupId", "Hcpcscode")]
[Table("BLHCPCSGroupCode")]
public partial class BlhcpcsgroupCode
{
    [Key]
    public long GroupId { get; set; }

    [Key]
    [Column("HCPCSCode")]
    [StringLength(11)]
    public string Hcpcscode { get; set; } = null!;

    [StringLength(2000)]
    public string DescriptionUser { get; set; } = null!;

    [Column(TypeName = "money")]
    public decimal? UnitPrice { get; set; }

    [StringLength(2000)]
    public string? ProviderDescription { get; set; }

    [Key]
    public long GroupCodeId { get; set; }

    public long PayerId { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("GroupId")]
    [InverseProperty("BlhcpcsgroupCode")]
    public virtual Blhcpcsgroup Group { get; set; } = null!;

    [ForeignKey("Hcpcscode")]
    [InverseProperty("BlhcpcsgroupCode")]
    public virtual BlmasterHcpcs HcpcscodeNavigation { get; set; } = null!;
}
