using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("HREmployeeFacility")]
[Index("EmployeeId", Name = "IX_HREmployeeFacility_EmployeeId")]
[Index("FacilityId", Name = "IX_HREmployeeFacility_FacilityID")]
public partial class HremployeeFacility
{
    [Key]
    [Column("EmployeeFacilityID")]
    public int EmployeeFacilityId { get; set; }

    public long EmployeeId { get; set; }

    [Column("FacilityID")]
    public int FacilityId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedOn { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedOn { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? UpdatedBy { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [ForeignKey("EmployeeId")]
    [InverseProperty("HremployeeFacility")]
    public virtual Hremployee Employee { get; set; } = null!;

    [ForeignKey("FacilityId")]
    [InverseProperty("HremployeeFacility")]
    public virtual RegFacility Facility { get; set; } = null!;
}
