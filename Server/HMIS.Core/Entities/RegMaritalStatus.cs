using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("RegMaritalStatus")]
public partial class RegMaritalStatus
{
    [Key]
    public int MaritalStatusId { get; set; }

    [StringLength(255)]
    public string? MaritalStatus { get; set; }

    public bool? IsDeleted { get; set; }
}
