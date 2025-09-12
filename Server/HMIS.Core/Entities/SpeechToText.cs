using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("SpeechToText")]
public partial class SpeechToText
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    public long PatientId { get; set; }

    [Column("NoteHTMLText", TypeName = "ntext")]
    public string? NoteHtmltext { get; set; }

    [Column(TypeName = "ntext")]
    public string? NoteText { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedOn { get; set; }

    [Column("MRNo")]
    [StringLength(10)]
    [Unicode(false)]
    public string? Mrno { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string NoteTitle { get; set; } = null!;

    [StringLength(200)]
    [Unicode(false)]
    public string? Description { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? CreatedBy { get; set; }

    public bool? SignedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? VisitDate { get; set; }

    public bool? IsDeleted { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? UpdatedBy { get; set; }

    public string? NotePath { get; set; }

    [ForeignKey("PatientId")]
    [InverseProperty("SpeechToTexts")]
    public virtual RegPatient Patient { get; set; } = null!;
}
