using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class ProblemList
{
    [Key]
    public long ProblemId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string ProblemName { get; set; } = null!;

    [StringLength(200)]
    [Unicode(false)]
    public string? ProblemDesc { get; set; }

    public bool? InActive { get; set; }

    [Column("facilityId")]
    public int? FacilityId { get; set; }

    public bool? HideToProvider { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("PurposeOfVisitNavigation")]
    public virtual ICollection<SchAppointment> SchAppointment { get; set; } = new List<SchAppointment>();
}
