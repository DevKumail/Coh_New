using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("EMRNotesQuestion")]
public partial class EmrnotesQuestion
{
    [Key]
    [Column("Quest_Id")]
    public long QuestId { get; set; }

    [Column("Quest_Title")]
    [StringLength(250)]
    [Unicode(false)]
    public string QuestTitle { get; set; } = null!;

    [Column("Quest_Type")]
    public int QuestType { get; set; }

    [Column("Quest_Desription")]
    [StringLength(500)]
    [Unicode(false)]
    public string? QuestDesription { get; set; }

    [Column("Ans_Size")]
    public int? AnsSize { get; set; }

    [Column("Quest_Table")]
    [StringLength(50)]
    [Unicode(false)]
    public string? QuestTable { get; set; }

    [Column("Parent_Id")]
    public long ParentId { get; set; }

    [Column("Validation_Type")]
    public int? ValidationType { get; set; }

    [Column("Quest_Order")]
    public int? QuestOrder { get; set; }

    [Column("prefix")]
    [StringLength(250)]
    [Unicode(false)]
    public string? Prefix { get; set; }

    [Column("postfix")]
    [StringLength(250)]
    [Unicode(false)]
    public string? Postfix { get; set; }

    [Column("negativePrefix")]
    [StringLength(250)]
    [Unicode(false)]
    public string? NegativePrefix { get; set; }

    [Column("negativepostfix")]
    [StringLength(250)]
    [Unicode(false)]
    public string? Negativepostfix { get; set; }

    public bool? Inactive { get; set; }

    public Guid? ImageId { get; set; }

    public long? WeqayaId { get; set; }

    public DateTime? CreatedAt { get; set; }

    [StringLength(100)]
    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [StringLength(100)]
    public string? UpdatedBy { get; set; }
}
