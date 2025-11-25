using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[PrimaryKey("ProviderId", "SpecialtyId")]
public partial class ProviderSpecialtyAssign
{
    [Key]
    public long ProviderId { get; set; }

    [Key]
    [Column("SpecialtyID")]
    public int SpecialtyId { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }
}
