using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("IVFMedicationPresentationForm")]
public partial class IvfmedicationPresentationForm
{
    [Key]
    [Column("IVFMedicationPresentationFormId")]
    public long IvfmedicationPresentationFormId { get; set; }

    public long CategoryId { get; set; }

    public long MedicationId { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? DeletedBy { get; set; }

    public bool IsDeleted { get; set; }

    [ForeignKey("CategoryId")]
    [InverseProperty("IvfmedicationPresentationForm")]
    public virtual DropdownConfiguration Category { get; set; } = null!;

    [ForeignKey("MedicationId")]
    [InverseProperty("IvfmedicationPresentationForm")]
    public virtual Medications Medication { get; set; } = null!;
}
