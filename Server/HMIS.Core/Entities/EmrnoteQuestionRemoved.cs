using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("EMRNoteQuestion_Removed")]
public partial class EmrnoteQuestionRemoved
{
    [Key]
    public long Id { get; set; }

    [Column("Question_Id")]
    public long QuestionId { get; set; }
}
