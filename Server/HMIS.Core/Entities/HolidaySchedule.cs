using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("HolidaySchedule")]
public partial class HolidaySchedule
{
    [Key]
    public long HolidayScheduleId { get; set; }

    public bool IsHoliday { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string? HolidayName { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Comments { get; set; }

    [Column("SiteID")]
    public int? SiteId { get; set; }

    [StringLength(4)]
    [Unicode(false)]
    public string? Years { get; set; }

    [StringLength(4)]
    [Unicode(false)]
    public string? MonthDay { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string? StartingTime { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string? EndingTime { get; set; }

    public bool IsActive { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? UpdateBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? ErrorMessage { get; set; }

    public bool? IsDeleted { get; set; }
}
