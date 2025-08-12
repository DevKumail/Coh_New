using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("CPTByAppType")]
public partial class CptbyAppType
{
    [Key]
    public long GroupId { get; set; }

    [StringLength(50)]
    public string GroupName { get; set; } = null!;

    public int AppTypeId { get; set; }

    public bool Active { get; set; }

    public bool Approve { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    [StringLength(50)]
    public string CreatedBy { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime UpdatedDate { get; set; }

    [StringLength(50)]
    public string UpdatedBy { get; set; } = null!;

    [ForeignKey("AppTypeId")]
    [InverseProperty("CptbyAppTypes")]
    public virtual SchAppointmentType AppType { get; set; } = null!;

    [InverseProperty("Group")]
    public virtual ICollection<CptsInCptbyAppType> CptsInCptbyAppTypes { get; set; } = new List<CptsInCptbyAppType>();
}
