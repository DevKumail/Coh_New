using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("ProviderScheduleByAppType")]
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

    [ForeignKey("AppTypeId")]
    [InverseProperty("ProviderScheduleByAppTypes")]
    public virtual SchAppointmentType? AppType { get; set; }

    [ForeignKey("Psid")]
    [InverseProperty("ProviderScheduleByAppTypes")]
    public virtual ProviderSchedule Ps { get; set; } = null!;
}
