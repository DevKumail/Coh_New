using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("EMRNotesEncounterPath")]
public partial class EmrnotesEncounterPath
{
    [Key]
    public int PathId { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string PathName { get; set; } = null!;

    [StringLength(250)]
    [Unicode(false)]
    public string? PathDescription { get; set; }

    [Column(TypeName = "ntext")]
    public string? TemplateText { get; set; }

    [Column("TemplateHTML", TypeName = "ntext")]
    public string? TemplateHtml { get; set; }

    [StringLength(2000)]
    [Unicode(false)]
    public string? RefrenceInfo { get; set; }

    public bool Active { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string? TemplateType { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string? Category { get; set; }

    public bool? NewFormatting { get; set; }

    public bool? DisplayPatientHeader { get; set; }

    public bool? DisallowCreateAsNew { get; set; }

    [Column("isWeqayaTemplate")]
    public bool? IsWeqayaTemplate { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [InverseProperty("Template")]
    public virtual ICollection<EmrnoteTemplate> EmrnoteTemplate { get; set; } = new List<EmrnoteTemplate>();
}
