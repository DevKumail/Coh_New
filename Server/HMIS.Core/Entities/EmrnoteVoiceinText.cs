using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("EMRNoteVoiceinText")]
public partial class EmrnoteVoiceinText
{
    [Key]
    public long Id { get; set; }

    public long? NotePathId { get; set; }

    public string? NoteName { get; set; }

    public string? VoiceInText { get; set; }

    [Column("active")]
    public bool? Active { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }
}
