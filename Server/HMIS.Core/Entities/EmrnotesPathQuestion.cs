using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("EMRNotesPathQuestion")]
public partial class EmrnotesPathQuestion
{
    [Column("Quest_Id")]
    public long QuestId { get; set; }

    [Column("Path_Id")]
    public int PathId { get; set; }

    [Column("Quest_Order")]
    public int? QuestOrder { get; set; }

    [Key]
    public long PathQuestionId { get; set; }

    public bool? Active { get; set; }

    public bool? HeadingLinked { get; set; }
}
