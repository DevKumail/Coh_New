using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("EMRNotesAnswer")]
public partial class EmrnotesAnswer
{
    [Key]
    public long AnswerId { get; set; }

    public long? NoteId { get; set; }

    public long QuestId { get; set; }

    [Column(TypeName = "ntext")]
    public string? Answer { get; set; }

    public bool Inactive { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string? Mrno { get; set; }

    public long? VisitAcNo { get; set; }

    public bool? IsHistory { get; set; }

    [Column("oldMRNo")]
    [StringLength(20)]
    [Unicode(false)]
    public string? OldMrno { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }
}
