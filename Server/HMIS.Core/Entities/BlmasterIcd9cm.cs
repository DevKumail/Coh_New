﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BLMasterICD9CM")]
public partial class BlmasterIcd9cm
{
    [Key]
    [Column("ICD9Code")]
    [StringLength(11)]
    public string Icd9code { get; set; } = null!;

    [StringLength(1)]
    public string? Validity { get; set; }

    [StringLength(255)]
    public string? DescriptionShort { get; set; }

    [StringLength(255)]
    public string? DescriptionLong { get; set; }

    [Column(TypeName = "ntext")]
    public string? DescriptionFull { get; set; }

    [StringLength(1)]
    public string? Status { get; set; }

    [StringLength(1)]
    public string? Type { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    [Column("ExclusionUAEServiceGroup")]
    public short? ExclusionUaeserviceGroup { get; set; }

    [Column("ICDVersionId")]
    public int? IcdversionId { get; set; }

    [Column("isOnsetDx")]
    public bool? IsOnsetDx { get; set; }

    [StringLength(2000)]
    public string? DescriptionCustomized { get; set; }

    public long SerialNo { get; set; }

    public bool IsNotForPrincipal { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("Icd9codeNavigation")]
    public virtual ICollection<Blicd9cmgroupCode> Blicd9cmgroupCode { get; set; } = new List<Blicd9cmgroupCode>();

    [InverseProperty("Icd9codeNavigation")]
    public virtual ICollection<BlsuperBillDiagnosis> BlsuperBillDiagnosis { get; set; } = new List<BlsuperBillDiagnosis>();
}
