using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleFHFurtherPlanning")]
public partial class IvfmaleFhfurtherPlanning
{
    [Key]
    [Column("IVFMaleFHFurtherPlanningId")]
    public int IvfmaleFhfurtherPlanningId { get; set; }

    [Column("IVFMaleFHGeneralId")]
    public int IvfmaleFhgeneralId { get; set; }

    public bool SemenAnalysis { get; set; }

    public bool MorphologicalExamination { get; set; }

    public bool SerologicalExamination { get; set; }

    public bool AndrologicalUrologicalConsultation { get; set; }

    [Column("DNAFragmentation")]
    public bool Dnafragmentation { get; set; }

    public bool SpermFreezing { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("IvfmaleFhgeneralId")]
    [InverseProperty("IvfmaleFhfurtherPlanning")]
    public virtual IvfmaleFhgeneral IvfmaleFhgeneral { get; set; } = null!;
}
