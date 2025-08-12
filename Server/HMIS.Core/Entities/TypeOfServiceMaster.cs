using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("TypeOfServiceMaster")]
public partial class TypeOfServiceMaster
{
    [Key]
    public int ServiceTypeId { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string Name { get; set; } = null!;

    public bool? Active { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("ServiceType")]
    public virtual ICollection<BlcptmasterRange> BlcptmasterRanges { get; set; } = new List<BlcptmasterRange>();
}
