using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("HRLicenseInfo")]
[Index("LicenseNo", Name = "UQ__HRLicens__72D7E8707265ACFE", IsUnique = true)]
public partial class HrlicenseInfo
{
    [Key]
    [Column("HRLicenseId")]
    public int HrlicenseId { get; set; }

    public long EmployeeId { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? LicenseName { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ExpiryDate { get; set; }

    public bool? Active { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? LicenseNo { get; set; }

    public bool? IsDeleted { get; set; }

    [ForeignKey("EmployeeId")]
    [InverseProperty("HrlicenseInfos")]
    public virtual Hremployee Employee { get; set; } = null!;
}
