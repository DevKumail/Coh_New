using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFOverviewEpisodeAppointments")]
public partial class IvfoverviewEpisodeAppointments
{
    [Key]
    [Column("IVFOverviewEpisodeAppId")]
    public int IvfoverviewEpisodeAppId { get; set; }

    public long? OverviewId { get; set; }

    public long? AppId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("AppId")]
    [InverseProperty("IvfoverviewEpisodeAppointments")]
    public virtual SchAppointment? App { get; set; }

    [ForeignKey("OverviewId")]
    [InverseProperty("IvfoverviewEpisodeAppointments")]
    public virtual IvftreatmentEpisodeOverviewStage? Overview { get; set; }
}
