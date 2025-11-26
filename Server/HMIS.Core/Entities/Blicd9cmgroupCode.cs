using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[PrimaryKey("GroupId", "Icd9code", "GroupCodeId")]
[Table("BLICD9CMGroupCode")]
public partial class Blicd9cmgroupCode
{
    [Key]
    public long GroupId { get; set; }

    [Key]
    [Column("ICD9Code")]
    [StringLength(11)]
    public string Icd9code { get; set; } = null!;

    [StringLength(2000)]
    public string? DescriptionUser { get; set; }

    [StringLength(2000)]
    public string? ProviderDescription { get; set; }

    [Key]
    public int GroupCodeId { get; set; }

    [Column("ICDVersionId")]
    public long? IcdversionId { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("GroupId")]
    [InverseProperty("Blicd9cmgroupCode")]
    public virtual Blicd9cmgroup Group { get; set; } = null!;

    [ForeignKey("Icd9code")]
    [InverseProperty("Blicd9cmgroupCode")]
    public virtual BlmasterIcd9cm Icd9codeNavigation { get; set; } = null!;
}
