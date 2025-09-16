using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Keyless]
public partial class PatientAllergyDetail
{
    [Column("DAMId")]
    public long? Damid { get; set; }

    public long? AllergyId { get; set; }

    [Column("DAMIdType")]
    public long? DamidType { get; set; }

    [Column("DAMIdDetail")]
    [StringLength(300)]
    [Unicode(false)]
    public string? DamidDetail { get; set; }

    public bool? IsDeleted { get; set; }
}
