using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Core.Entities;

[Table("PatientAllergy")]
public partial class PatientAllergy
{
    [Key]
    public long AllergyId { get; set; }

    public long? TypeId { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Reaction { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? StartDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? EndDate { get; set; }

    public byte Status { get; set; }

    public bool Active { get; set; }

    public long? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime UpdatedDate { get; set; }

    public long? ProviderId { get; set; }

    [Column("MRNo")]
    [StringLength(10)]
    [Unicode(false)]
    public string? Mrno { get; set; }

    public long? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    public long? SeverityCode { get; set; }

    [StringLength(150)]
    [Unicode(false)]
    public string? Allergen { get; set; }

    [Column("IsHL7MsgCreated")]
    public bool? IsHl7msgCreated { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ReviewedDate { get; set; }

    [StringLength(50)]
    public string? ReviewedBy { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? ErrorReason { get; set; }

    [Column("oldMRNo")]
    [StringLength(20)]
    [Unicode(false)]
    public string? OldMrno { get; set; }

    public bool? IsDeleted { get; set; }

    public long? AppointmentId { get; set; }

    [ForeignKey("AppointmentId")]
    [InverseProperty("PatientAllergies")]
    public virtual SchAppointment? Appointment { get; set; }

    [ForeignKey("CreatedBy")]
    [InverseProperty("PatientAllergyCreatedByNavigations")]
    public virtual Hremployee? CreatedByNavigation { get; set; }

    [ForeignKey("ProviderId")]
    [InverseProperty("PatientAllergyProviders")]
    public virtual Hremployee? Provider { get; set; }

    [ForeignKey("SeverityCode")]
    [InverseProperty("PatientAllergies")]
    public virtual SeverityType? SeverityCodeNavigation { get; set; }

    [ForeignKey("TypeId")]
    [InverseProperty("PatientAllergies")]
    public virtual AlergyType? Type { get; set; }

    [ForeignKey("UpdatedBy")]
    [InverseProperty("PatientAllergyUpdatedByNavigations")]
    public virtual Hremployee? UpdatedByNavigation { get; set; }
}
