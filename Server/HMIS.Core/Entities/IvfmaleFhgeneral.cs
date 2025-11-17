using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleFHGeneral")]
public partial class IvfmaleFhgeneral
{
    [Key]
    [Column("IVFMaleFHGeneralId")]
    public int IvfmaleFhgeneralId { get; set; }

    [Column("IVFMaleFHId")]
    public int IvfmaleFhid { get; set; }

    public bool? HasChildren { get; set; }

    public int? Girls { get; set; }

    public int? Boys { get; set; }

    [StringLength(50)]
    public string? InfertileSince { get; set; }

    public bool? AndrologicalDiagnosisPerformed { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? Date { get; set; }

    [StringLength(30)]
    public string? InfertilityType { get; set; }

    [ForeignKey("IvfmaleFhid")]
    [InverseProperty("IvfmaleFhgeneral")]
    public virtual IvfmaleFertilityHistory IvfmaleFh { get; set; } = null!;

    [InverseProperty("IvfmaleFhgeneral")]
    public virtual ICollection<IvfmaleFhfurtherPlanning> IvfmaleFhfurtherPlanning { get; set; } = new List<IvfmaleFhfurtherPlanning>();

    [InverseProperty("IvfmaleFhgeneral")]
    public virtual ICollection<IvfmaleFhillness> IvfmaleFhillness { get; set; } = new List<IvfmaleFhillness>();

    [InverseProperty("IvfmaleFhgeneral")]
    public virtual ICollection<IvfmaleFhperformedTreatment> IvfmaleFhperformedTreatment { get; set; } = new List<IvfmaleFhperformedTreatment>();
}
