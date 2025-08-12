using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BLCPTGroup")]
public partial class Blcptgroup
{
    [Key]
    public long GroupId { get; set; }

    [StringLength(250)]
    [Unicode(false)]
    public string GroupName { get; set; } = null!;

    public long ProviderId { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("Group")]
    public virtual ICollection<BlcptgroupCode> BlcptgroupCodes { get; set; } = new List<BlcptgroupCode>();
}
