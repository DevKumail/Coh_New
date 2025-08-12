using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BLMasterDentalCodes")]
public partial class BlmasterDentalCode
{
    [Key]
    [StringLength(50)]
    [Unicode(false)]
    public string DentalCode { get; set; } = null!;

    [Unicode(false)]
    public string? DescriptionShort { get; set; }

    [Unicode(false)]
    public string? DescriptionLong { get; set; }

    [Unicode(false)]
    public string? DescriptionFull { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Price { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? Enddate { get; set; }

    public bool? ToothNumber { get; set; }

    public bool? IsActive { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Chapter { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string? CodingSystem { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("DentalCodeNavigation")]
    public virtual ICollection<BldentalGroupCode> BldentalGroupCodes { get; set; } = new List<BldentalGroupCode>();
}
