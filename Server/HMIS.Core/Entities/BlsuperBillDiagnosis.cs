using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("BLSuperBillDiagnosis")]
public partial class BlsuperBillDiagnosis
{
    [Key]
    public long DiagnosisId { get; set; }

    [Column("ICD9Code")]
    [StringLength(11)]
    public string? Icd9code { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? LastUpdatedDate { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? LastUpdatedBy { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? DiagnosisPriority { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? DiagnosisType { get; set; }

    public bool? Confidential { get; set; }

    [Column("IsHL7MsgCreated")]
    public bool? IsHl7msgCreated { get; set; }

    [Column("ICDOrder")]
    public int? Icdorder { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Type { get; set; }

    [StringLength(2000)]
    public string? Descriptionshort { get; set; }

    [Column("ICDVersionId")]
    public long? IcdversionId { get; set; }

    [StringLength(4)]
    [Unicode(false)]
    public string? YearofOnset { get; set; }

    public bool? IsDeleted { get; set; }

    public long? AppointmentId { get; set; }

    [ForeignKey("AppointmentId")]
    [InverseProperty("BlsuperBillDiagnoses")]
    public virtual SchAppointment? Appointment { get; set; }

    [ForeignKey("Icd9code")]
    [InverseProperty("BlsuperBillDiagnoses")]
    public virtual BlmasterIcd9cm? Icd9codeNavigation { get; set; }

    [ForeignKey("IcdversionId")]
    [InverseProperty("BlsuperBillDiagnoses")]
    public virtual Blicdversion? Icdversion { get; set; }
}
