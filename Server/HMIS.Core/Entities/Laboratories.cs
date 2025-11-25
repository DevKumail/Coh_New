using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class Laboratories
{
    [Key]
    public int LaboratoryId { get; set; }

    [StringLength(255)]
    public string LaboratoryName { get; set; } = null!;

    [StringLength(255)]
    public string? EnterpriseUniqueId { get; set; }

    [StringLength(255)]
    public string? Address1 { get; set; }

    [StringLength(255)]
    public string? Address2 { get; set; }

    public int? CityId { get; set; }

    public int? StateId { get; set; }

    public int? CountryId { get; set; }

    [StringLength(50)]
    public string? ZipCode { get; set; }

    [StringLength(255)]
    public string? Email { get; set; }

    [StringLength(50)]
    public string? Phone { get; set; }

    [StringLength(50)]
    public string? CellNo { get; set; }

    [StringLength(50)]
    public string? Fax { get; set; }

    [StringLength(50)]
    public string? PreferredContactMethod { get; set; }

    [StringLength(500)]
    public string? Description { get; set; }

    public bool? Active { get; set; }

    [StringLength(10)]
    public string? EntityType { get; set; }

    public int? SendOrderWhen { get; set; }

    [Column("SiteID")]
    public int? SiteId { get; set; }

    [StringLength(255)]
    public string? SiteApplicationName { get; set; }

    [Column("SiteApplicationID")]
    [StringLength(255)]
    public string? SiteApplicationId { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [InverseProperty("Laboratory")]
    public virtual ICollection<LabTests> LabTests { get; set; } = new List<LabTests>();
}
