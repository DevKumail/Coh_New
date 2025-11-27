using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("EMRNotesNote")]
public partial class EmrnotesNote
{
    [Key]
    public long NoteId { get; set; }

    public long? VisitAcNo { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string NotesTitle { get; set; } = null!;

    [Column(TypeName = "ntext")]
    public string? NoteText { get; set; }

    [Column("NoteHTMLText", TypeName = "ntext")]
    public string? NoteHtmltext { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Description { get; set; }

    public int? CreatedBy { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? CreatedOn { get; set; }

    public int? UpdatedBy { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? UpdatedDate { get; set; }

    [Column("signed")]
    public bool Signed { get; set; }

    public bool IsEdit { get; set; }

    public bool? Review { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? NoteType { get; set; }

    public bool Active { get; set; }

    public long? SignedBy { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string? SignedDate { get; set; }

    public long? CosignedBy { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string? CosignedDate { get; set; }

    [Column("MRCosignedBy")]
    public long? MrcosignedBy { get; set; }

    [Column("MRCosignedDate")]
    [StringLength(14)]
    [Unicode(false)]
    public string? MrcosignedDate { get; set; }

    public long? NoteCosignProvId { get; set; }

    public long? ReviewedBy { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string? ReviewedDate { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? NoteStatus { get; set; }

    [Column("MRNo")]
    [StringLength(10)]
    [Unicode(false)]
    public string? Mrno { get; set; }

    [Column(TypeName = "image")]
    public byte[]? Documents { get; set; }

    public Guid? CaseId { get; set; }

    public bool? IsNursingNote { get; set; }

    public int? ReceiverRoleId { get; set; }

    public long? ReceiverEmpId { get; set; }

    public Guid? ReferredSiteId { get; set; }

    public long? LabOrderSetDetailId { get; set; }

    [Column("oldMRNo")]
    [StringLength(20)]
    [Unicode(false)]
    public string? OldMrno { get; set; }

    [Column("IsMBRCompleted")]
    public bool? IsMbrcompleted { get; set; }

    public long? OldNoteId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [InverseProperty("Note")]
    public virtual ICollection<EmrnoteTemplate> EmrnoteTemplate { get; set; } = new List<EmrnoteTemplate>();
}
