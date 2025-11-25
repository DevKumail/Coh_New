using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class ProviderSpecialty
{
    [Key]
    [Column("SpecialtyID")]
    public int SpecialtyId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? SpecialtyName { get; set; }

    [StringLength(4)]
    [Unicode(false)]
    public string? SpecialtyCode { get; set; }

    public bool Active { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? MappingForReferralOffice { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [InverseProperty("Speciality")]
    public virtual ICollection<ProviderSchedule> ProviderSchedule { get; set; } = new List<ProviderSchedule>();
}
