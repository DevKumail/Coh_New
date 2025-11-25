using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

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

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [InverseProperty("AppType")]
    public virtual ICollection<CptbyAppType> CptbyAppType { get; set; } = new List<CptbyAppType>();

    [InverseProperty("AppType")]
    public virtual ICollection<ProviderScheduleByAppType> ProviderScheduleByAppType { get; set; } = new List<ProviderScheduleByAppType>();
}
