using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BLICD9CMGroup")]
public partial class Blicd9cmgroup
{
    [Key]
    public long GroupId { get; set; }

    [StringLength(250)]
    [Unicode(false)]
    public string GroupName { get; set; } = null!;

    public long ProviderId { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("Group")]
    public virtual ICollection<Blicd9cmgroupCode> Blicd9cmgroupCodes { get; set; } = new List<Blicd9cmgroupCode>();
}
