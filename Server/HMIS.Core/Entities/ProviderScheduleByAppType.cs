using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class ProviderScheduleByAppType
{
    [Key]
    public long Id { get; set; }

    [Column("PSID")]
    public long Psid { get; set; }

    public int? AppTypeId { get; set; }

    public long Duration { get; set; }

    [Column("CPTGroupId")]
    public long? CptgroupId { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("AppTypeId")]
    [InverseProperty("ProviderScheduleByAppType")]
    public virtual SchAppointmentType? AppType { get; set; }

    [ForeignKey("Psid")]
    [InverseProperty("ProviderScheduleByAppType")]
    public virtual ProviderSchedule Ps { get; set; } = null!;
}
