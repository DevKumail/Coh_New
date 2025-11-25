using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

public partial class Language
{
    [Key]
    public int LanguageId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string LanguageName { get; set; } = null!;

    [StringLength(10)]
    [Unicode(false)]
    public string? LanguageCode { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }
}
