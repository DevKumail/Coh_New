using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class RegCountries
{
    [Key]
    public int CountryId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string Name { get; set; } = null!;

    [StringLength(200)]
    [Unicode(false)]
    public string? Description { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string? MalaffiCode { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [InverseProperty("Country")]
    public virtual ICollection<InsuredSubscriber> InsuredSubscriber { get; set; } = new List<InsuredSubscriber>();

    [InverseProperty("Country")]
    public virtual ICollection<IvfepisodeBirth> IvfepisodeBirth { get; set; } = new List<IvfepisodeBirth>();

    [InverseProperty("Nokcountry")]
    public virtual ICollection<RegPatientTemp> RegPatientTempNokcountry { get; set; } = new List<RegPatientTemp>();

    [InverseProperty("PersonCountry")]
    public virtual ICollection<RegPatientTemp> RegPatientTempPersonCountry { get; set; } = new List<RegPatientTemp>();
}
