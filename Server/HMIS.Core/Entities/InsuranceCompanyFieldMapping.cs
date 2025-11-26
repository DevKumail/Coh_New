using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class InsuranceCompanyFieldMapping
{
    [Key]
    public int Id { get; set; }

    public long? BlpayerId { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? CardFieldName { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? InternalFieldName { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }
}
