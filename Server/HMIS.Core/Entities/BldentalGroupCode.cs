using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[PrimaryKey("GroupCodeId", "GroupId", "DentalCode")]
[Table("BLDentalGroupCode")]
public partial class BldentalGroupCode
{
    [Key]
    [Column("GroupCodeID")]
    public long GroupCodeId { get; set; }

    [Key]
    public long GroupId { get; set; }

    [Key]
    [StringLength(50)]
    [Unicode(false)]
    public string DentalCode { get; set; } = null!;

    [StringLength(2000)]
    public string DescriptionUser { get; set; } = null!;

    [Column(TypeName = "money")]
    public decimal? UnitPrice { get; set; }

    public long PayerId { get; set; }

    [StringLength(2000)]
    public string? ProviderDescription { get; set; }

    public bool? IsDeleted { get; set; }

    [ForeignKey("DentalCode")]
    [InverseProperty("BldentalGroupCode")]
    public virtual BlmasterDentalCodes DentalCodeNavigation { get; set; } = null!;

    [ForeignKey("GroupId")]
    [InverseProperty("BldentalGroupCode")]
    public virtual BldentalGroup Group { get; set; } = null!;
}
