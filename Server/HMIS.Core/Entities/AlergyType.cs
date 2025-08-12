using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class AlergyType
{
    [Key]
    public long AlergyTypeId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string AlergyName { get; set; } = null!;

    [StringLength(200)]
    [Unicode(false)]
    public string? Description { get; set; }

    public bool? InActive { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string? Code { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("Type")]
    public virtual ICollection<PatientAllergy> PatientAllergies { get; set; } = new List<PatientAllergy>();
}
