using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFEpisodeBirthCongenitalMalformation")]
public partial class IvfepisodeBirthCongenitalMalformation
{
    [Key]
    public long CongenitalMalformationId { get; set; }

    public long BirthId { get; set; }

    [StringLength(11)]
    public string? CongenitalMalformationCategoryId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("BirthId")]
    [InverseProperty("IvfepisodeBirthCongenitalMalformation")]
    public virtual IvfepisodeBirth Birth { get; set; } = null!;

    [ForeignKey("CongenitalMalformationCategoryId")]
    [InverseProperty("IvfepisodeBirthCongenitalMalformation")]
    public virtual BlmasterIcd9cm? CongenitalMalformationCategory { get; set; }
}
