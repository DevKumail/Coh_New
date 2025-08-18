using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BLDentalGroup")]
public partial class BldentalGroup
{
    [Key]
    public long GroupId { get; set; }

    [StringLength(250)]
    [Unicode(false)]
    public string GroupName { get; set; } = null!;

    public long ProviderId { get; set; }

    [InverseProperty("Group")]
    public virtual ICollection<BldentalGroupCode> BldentalGroupCodes { get; set; } = new List<BldentalGroupCode>();
}
