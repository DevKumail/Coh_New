using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
public partial class VwRegPatientAndAppointmentdetail
{
    [Column(TypeName = "datetime")]
    public DateTime AppDateTime { get; set; }

    public int Duration { get; set; }

    public long ProviderId { get; set; }

    public int? FacilityId { get; set; }

    public int SiteId { get; set; }

    [Column("SpecialtyID")]
    public int? SpecialtyId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string PurposeOfVisit { get; set; } = null!;

    public bool IsActive { get; set; }

    public bool? IsDeleted { get; set; }

    [StringLength(212)]
    [Unicode(false)]
    public string? PersonName { get; set; }

    [Column("MRNo")]
    [StringLength(10)]
    [Unicode(false)]
    public string Mrno { get; set; } = null!;
}
