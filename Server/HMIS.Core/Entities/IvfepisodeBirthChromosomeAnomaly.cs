using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFEpisodeBirthChromosomeAnomaly")]
public partial class IvfepisodeBirthChromosomeAnomaly
{
    [Key]
    public long ChromosomeAnomalyId { get; set; }

    public long BirthId { get; set; }

    public long? ChromosomeAnomalyCategoryId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("BirthId")]
    [InverseProperty("IvfepisodeBirthChromosomeAnomaly")]
    public virtual IvfepisodeBirth Birth { get; set; } = null!;

    [ForeignKey("ChromosomeAnomalyCategoryId")]
    [InverseProperty("IvfepisodeBirthChromosomeAnomaly")]
    public virtual DropdownConfiguration? ChromosomeAnomalyCategory { get; set; }
}
