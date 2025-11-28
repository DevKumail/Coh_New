using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFTreatmentEpisodeOverviewStage")]
public partial class IvftreatmentEpisodeOverviewStage
{
    [Key]
    public long OverviewId { get; set; }

    [Column("IVFDashboardTreatmentEpisodeId")]
    public int? IvfdashboardTreatmentEpisodeId { get; set; }

    public int? StatusId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("IvfdashboardTreatmentEpisodeId")]
    [InverseProperty("IvftreatmentEpisodeOverviewStage")]
    public virtual IvfdashboardTreatmentCycle? IvfdashboardTreatmentEpisode { get; set; }

    [InverseProperty("Overview")]
    public virtual ICollection<IvfepisodeOverviewEvents> IvfepisodeOverviewEvents { get; set; } = new List<IvfepisodeOverviewEvents>();

    [InverseProperty("Overview")]
    public virtual ICollection<IvfoverviewEpisodeAppointments> IvfoverviewEpisodeAppointments { get; set; } = new List<IvfoverviewEpisodeAppointments>();

    [InverseProperty("Overview")]
    public virtual ICollection<IvfoverviewOhss> IvfoverviewOhss { get; set; } = new List<IvfoverviewOhss>();

    [InverseProperty("Overview")]
    public virtual ICollection<IvfprescriptionMaster> IvfprescriptionMaster { get; set; } = new List<IvfprescriptionMaster>();
}
