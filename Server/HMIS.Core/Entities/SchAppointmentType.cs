using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("SchAppointmentType")]
public partial class SchAppointmentType
{
    [Key]
    public int AppTypeId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string AppType { get; set; } = null!;

    public bool? IsScreening { get; set; }

    public bool? IsTelemedicine { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("AppType")]
    public virtual ICollection<CptbyAppType> CptbyAppTypes { get; set; } = new List<CptbyAppType>();

    [InverseProperty("AppType")]
    public virtual ICollection<ProviderScheduleByAppType> ProviderScheduleByAppTypes { get; set; } = new List<ProviderScheduleByAppType>();
}
