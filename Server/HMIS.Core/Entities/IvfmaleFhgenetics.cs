using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMaleFHGenetics")]
public partial class IvfmaleFhgenetics
{
    [Key]
    [Column("IVFMaleFHGeneticsId")]
    public int IvfmaleFhgeneticsId { get; set; }

    [StringLength(100)]
    public string? Genetics { get; set; }

    public long? CategoryIdInheritance { get; set; }

    public string? MedicalOpinion { get; set; }

    [ForeignKey("CategoryIdInheritance")]
    [InverseProperty("IvfmaleFhgenetics")]
    public virtual DropdownConfiguration? CategoryIdInheritanceNavigation { get; set; }
}
