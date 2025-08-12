using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class RegState
{
    [Key]
    [Column("StateID")]
    public int StateId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string Name { get; set; } = null!;

    [StringLength(200)]
    [Unicode(false)]
    public string? Description { get; set; }

    [Column("CountryID")]
    public int CountryId { get; set; }

    [Column("HAADCityCode")]
    [StringLength(5)]
    [Unicode(false)]
    public string? HaadcityCode { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("State")]
    public virtual ICollection<InsuredSubscriber> InsuredSubscribers { get; set; } = new List<InsuredSubscriber>();

    [InverseProperty("State")]
    public virtual ICollection<RegPatientDetail> RegPatientDetails { get; set; } = new List<RegPatientDetail>();

    [InverseProperty("Nokstate")]
    public virtual ICollection<RegPatientTemp> RegPatientTempNokstates { get; set; } = new List<RegPatientTemp>();

    [InverseProperty("PersonState")]
    public virtual ICollection<RegPatientTemp> RegPatientTempPersonStates { get; set; } = new List<RegPatientTemp>();
}
