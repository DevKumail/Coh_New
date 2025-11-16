using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleFHIllness")]
public partial class IvfmaleFhillness
{
    [Key]
    [Column("IVFMaleFHIllnessId")]
    public int IvfmaleFhillnessId { get; set; }

    [Column("IVFMaleFHGeneralId")]
    public int? IvfmaleFhgeneralId { get; set; }

    public bool? Idiopathic { get; set; }

    public bool? MumpsAfterPuberty { get; set; }

    [StringLength(50)]
    public string? Endocrinopathies { get; set; }

    [StringLength(50)]
    public string? PreviousTumor { get; set; }

    public bool? Hepatitis { get; set; }

    [StringLength(200)]
    public string? HepatitisDetails { get; set; }

    public bool? ExistingAllergies { get; set; }

    [StringLength(200)]
    public string? ExistingAllergiesDetails { get; set; }

    [StringLength(200)]
    public string? ChronicIllnesses { get; set; }

    [StringLength(200)]
    public string? OtherDiseases { get; set; }

    [ForeignKey("IvfmaleFhgeneralId")]
    [InverseProperty("IvfmaleFhillness")]
    public virtual IvfmaleFhgeneral? IvfmaleFhgeneral { get; set; }
}
