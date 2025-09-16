using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class SchAppointmentCriteria
{
    [Key]
    public int CriteriaId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string CriteriaName { get; set; } = null!;

    public int? DisplayOrder { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("AppCriteria")]
    public virtual ICollection<SchAppointment> SchAppointment { get; set; } = new List<SchAppointment>();
}
