using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class RegCompany
{
    [Key]
    public long Id { get; set; }

    public string? CompanyName { get; set; }

    public string? Address { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    public long? CreatedById { get; set; }

    public string? ContactPerson { get; set; }

    [StringLength(50)]
    public string? ContactNo { get; set; }

    [StringLength(50)]
    public string? Desination { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [ForeignKey("CreatedById")]
    [InverseProperty("RegCompany")]
    public virtual Hremployee? CreatedByNavigation { get; set; }

    [InverseProperty("Company")]
    public virtual ICollection<RegFacility> RegFacility { get; set; } = new List<RegFacility>();
}
