using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[PrimaryKey("NoteId", "TemplateId")]
[Table("EMRNoteTemplate")]
public partial class EmrnoteTemplate
{
    [Key]
    public long NoteId { get; set; }

    [Key]
    public int TemplateId { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }

    [ForeignKey("NoteId")]
    [InverseProperty("EmrnoteTemplate")]
    public virtual EmrnotesNote Note { get; set; } = null!;

    [ForeignKey("TemplateId")]
    [InverseProperty("EmrnoteTemplate")]
    public virtual EmrnotesEncounterPath Template { get; set; } = null!;
}
