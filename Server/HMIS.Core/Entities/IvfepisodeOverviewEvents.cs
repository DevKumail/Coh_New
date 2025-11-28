using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFEpisodeOverviewEvents")]
public partial class IvfepisodeOverviewEvents
{
    [Key]
    public long EventId { get; set; }

    public long AppointmentId { get; set; }

    public long OverviewId { get; set; }

    public long EventTypeCategoryId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? StartDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? EndDate { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("AppointmentId")]
    [InverseProperty("IvfepisodeOverviewEvents")]
    public virtual SchAppointment Appointment { get; set; } = null!;

    [ForeignKey("EventTypeCategoryId")]
    [InverseProperty("IvfepisodeOverviewEvents")]
    public virtual DropdownConfiguration EventTypeCategory { get; set; } = null!;

    [ForeignKey("OverviewId")]
    [InverseProperty("IvfepisodeOverviewEvents")]
    public virtual IvftreatmentEpisodeOverviewStage Overview { get; set; } = null!;
}
