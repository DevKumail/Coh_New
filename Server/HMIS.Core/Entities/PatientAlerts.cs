using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class PatientAlerts
{
    [Key]
    [Column("AlertID")]
    public long AlertId { get; set; }

    public long? RuleId { get; set; }

    [Column("MRNO")]
    [StringLength(10)]
    [Unicode(false)]
    public string? Mrno { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? AlertMessage { get; set; }

    public bool Active { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? RepeatDate { get; set; }

    [Column("isFinished")]
    public bool IsFinished { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? EnteredBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? EnteredDate { get; set; }

    [StringLength(25)]
    [Unicode(false)]
    public string? UpdatedBy { get; set; }

    public long? AppointmentId { get; set; }

    public int AlertTypeId { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? Comments { get; set; }

    public bool? HasChild { get; set; }

    [Column("oldMRNo")]
    [StringLength(20)]
    [Unicode(false)]
    public string? OldMrno { get; set; }

    public bool? IsDeleted { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? StartDate { get; set; }

    [Key]
    [Column("AlertID")]
    public long AlertId { get; set; }

    [Column(TypeName = "UpdateDate")]
    public DateTime? UpdateDate { get; set; }
}
