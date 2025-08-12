using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BLICDVersion")]
public partial class Blicdversion
{
    [Key]
    [Column("ICDVersionId")]
    public long IcdversionId { get; set; }

    [Column("ICDVersion")]
    [StringLength(50)]
    [Unicode(false)]
    public string Icdversion { get; set; } = null!;

    /// <summary>
    /// All Active versions List to show in Charge Capture screen in RadioButtonList or Drop-Down List. active list will be shown to end user for end user selection. Select version select at GUI by default based on DOS check.
    /// </summary>
    public bool Active { get; set; }

    /// <summary>
    /// DOS (Appointment Date) if defined then to apply starting date to effect using ICD version. If Null then No Date Check to apply
    /// </summary>
    [Column("DOSStartDate", TypeName = "datetime")]
    public DateTime? DosstartDate { get; set; }

    /// <summary>
    /// DOS (Appointment Date) if defined then to apply end date to effect using ICD version. If Null then No Date Check to apply
    /// </summary>
    [Column("DOSEndDate", TypeName = "datetime")]
    public DateTime? DosendDate { get; set; }

    [Column("SearchFromDB")]
    public bool? SearchFromDb { get; set; }

    [Column("ordering")]
    public int? Ordering { get; set; }

    public bool? IsDeleted { get; set; }

    [InverseProperty("Icdversion")]
    public virtual ICollection<BlsuperBillDiagnosis> BlsuperBillDiagnoses { get; set; } = new List<BlsuperBillDiagnosis>();
}
