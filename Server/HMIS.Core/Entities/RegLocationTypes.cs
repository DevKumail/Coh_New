using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class RegLocationTypes
{
    [Key]
    public int TypeId { get; set; }

    [StringLength(35)]
    [Unicode(false)]
    public string Name { get; set; } = null!;

    [StringLength(200)]
    [Unicode(false)]
    public string? Description { get; set; }

    [StringLength(55)]
    [Unicode(false)]
    public string? Address1 { get; set; }

    [StringLength(55)]
    [Unicode(false)]
    public string? Address2 { get; set; }

    public int? CityId { get; set; }

    public int? StateId { get; set; }

    public int? CountryId { get; set; }

    [StringLength(9)]
    [Unicode(false)]
    public string? ZipCode { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Email { get; set; }

    [StringLength(15)]
    [Unicode(false)]
    public string? Fax { get; set; }

    [StringLength(15)]
    [Unicode(false)]
    public string? Phone1 { get; set; }

    [StringLength(15)]
    [Unicode(false)]
    public string? Phone2 { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? SiteNum { get; set; }

    public bool? Active { get; set; }

    [StringLength(2)]
    [Unicode(false)]
    public string? PlaceOfService { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? OpeningTime { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ClosingTime { get; set; }

    [Column("DHCCCode")]
    [StringLength(20)]
    public string? Dhcccode { get; set; }

    [Column("FacilityID")]
    public int? FacilityId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? SiteCode { get; set; }

    public int? DefaultClassificationId { get; set; }

    [StringLength(100)]
    public string? SiteNameArabic { get; set; }

    [Column("GeoMapURL")]
    [StringLength(500)]
    [Unicode(false)]
    public string? GeoMapUrl { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("FacilityId")]
    [InverseProperty("RegLocationTypes")]
    public virtual RegFacility? Facility { get; set; }

    [InverseProperty("Site")]
    public virtual ICollection<RegPatientDetails> RegPatientDetails { get; set; } = new List<RegPatientDetails>();

    [InverseProperty("Site")]
    public virtual ICollection<SchAppointment> SchAppointment { get; set; } = new List<SchAppointment>();
}
