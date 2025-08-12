using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class RegCity
{
    [Key]
    public int CityId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string Name { get; set; } = null!;

    [StringLength(200)]
    [Unicode(false)]
    public string? Description { get; set; }

    public int StateId { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("City")]
    public virtual ICollection<InsuredSubscriber> InsuredSubscribers { get; set; } = new List<InsuredSubscriber>();

    [InverseProperty("City")]
    public virtual ICollection<RegPatientDetail> RegPatientDetails { get; set; } = new List<RegPatientDetail>();

    [InverseProperty("Nokcity")]
    public virtual ICollection<RegPatientTemp> RegPatientTempNokcities { get; set; } = new List<RegPatientTemp>();

    [InverseProperty("PersonCity")]
    public virtual ICollection<RegPatientTemp> RegPatientTempPersonCities { get; set; } = new List<RegPatientTemp>();
}
