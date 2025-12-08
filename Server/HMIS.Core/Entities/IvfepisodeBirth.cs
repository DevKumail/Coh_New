using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFEpisodeBirth")]
public partial class IvfepisodeBirth
{
    [Key]
    public long Id { get; set; }

    public long BirthId { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public int? Week { get; set; }

    public int? GenderId { get; set; }

    public long? DeliveryMethodCategoryId { get; set; }

    public int? Weight { get; set; }

    public int? Length { get; set; }

    public int? HeadCircumference { get; set; }

    [Column("APGAR1")]
    public int? Apgar1 { get; set; }

    [Column("APGAR5")]
    public int? Apgar5 { get; set; }

    public DateTime? DeathPostPartumOn { get; set; }

    public DateTime? DiedPerinatallyOn { get; set; }

    [StringLength(50)]
    public string? FirstName { get; set; }

    [StringLength(50)]
    public string? Surname { get; set; }

    [StringLength(50)]
    public string? PlaceOfBirth { get; set; }

    public int? CountryId { get; set; }

    public string? Note { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("BirthId")]
    [InverseProperty("IvfepisodeBirth")]
    public virtual IvftreatmentEpisodeBirthStage Birth { get; set; } = null!;

    [ForeignKey("CountryId")]
    [InverseProperty("IvfepisodeBirth")]
    public virtual RegCountries? Country { get; set; }

    [ForeignKey("DeliveryMethodCategoryId")]
    [InverseProperty("IvfepisodeBirth")]
    public virtual DropdownConfiguration? DeliveryMethodCategory { get; set; }

    [ForeignKey("GenderId")]
    [InverseProperty("IvfepisodeBirth")]
    public virtual RegGender? Gender { get; set; }

    [InverseProperty("Birth")]
    public virtual ICollection<IvfepisodeBirthChromosomeAnomaly> IvfepisodeBirthChromosomeAnomaly { get; set; } = new List<IvfepisodeBirthChromosomeAnomaly>();

    [InverseProperty("Birth")]
    public virtual ICollection<IvfepisodeBirthCongenitalMalformation> IvfepisodeBirthCongenitalMalformation { get; set; } = new List<IvfepisodeBirthCongenitalMalformation>();
}
