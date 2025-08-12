using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class Case
{
    [Key]
    [Column("CaseID")]
    public Guid CaseId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? CaseName { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? CaseDescription { get; set; }

    [Column("PatientMRNo")]
    [StringLength(10)]
    [Unicode(false)]
    public string? PatientMrno { get; set; }

    public bool? Active { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    public long? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public long? UpdatedBy { get; set; }

    [Column("MAIN_CASE_NO")]
    [StringLength(25)]
    [Unicode(false)]
    public string? MainCaseNo { get; set; }

    public Guid? ParentCaseId { get; set; }

    [Column("SUB_CASE_NO")]
    [StringLength(25)]
    [Unicode(false)]
    public string? SubCaseNo { get; set; }

    [Column("oldMRNo")]
    [StringLength(20)]
    [Unicode(false)]
    public string? OldMrno { get; set; }

    public bool? IsDeleted { get; set; }
}
