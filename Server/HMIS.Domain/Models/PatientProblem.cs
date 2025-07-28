using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("PatientProblem")]
    public partial class PatientProblem
    {
        [Key]
        public long Id { get; set; }
        public long? AppointmentId { get; set; }
        [Required]
        [Column("ICD9")]
        [StringLength(11)]
        [Unicode(false)]
        public string Icd9 { get; set; }
        [Column("ICD9Description")]
        [StringLength(2000)]
        [Unicode(false)]
        public string Icd9description { get; set; }
        [StringLength(200)]
        [Unicode(false)]
        public string Comments { get; set; }
        public long? ProviderId { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? StartDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? EndDate { get; set; }
        public byte? Status { get; set; }
        public bool? Active { get; set; }
        public long? UpdatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedDate { get; set; }
        [Column("MRNo")]
        [StringLength(10)]
        [Unicode(false)]
        public string Mrno { get; set; }
        public long? CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedDate { get; set; }
        [StringLength(25)]
        [Unicode(false)]
        public string DiagnosisPriority { get; set; }
        [StringLength(25)]
        [Unicode(false)]
        public string DiagnosisType { get; set; }
        public bool? Confidential { get; set; }
        [Column("IsHL7MsgCreated")]
        public bool? IsHl7msgCreated { get; set; }
        public bool? IsMedicalHistory { get; set; }
        public Guid? CaseId { get; set; }
        [StringLength(100)]
        [Unicode(false)]
        public string ErrorReason { get; set; }
        [Column("oldMRNo")]
        [StringLength(20)]
        [Unicode(false)]
        public string OldMrno { get; set; }
        [Column("ICDVersionID")]
        public int? IcdversionId { get; set; }
        public bool? IsDeleted { get; set; }
        public long? PatientId { get; set; }
        public bool? SocialHistory { get; set; }
        [StringLength(200)]
        public string OutsideClinic { get; set; }

        [ForeignKey("AppointmentId")]
        [InverseProperty("PatientProblems")]
        public virtual SchAppointment Appointment { get; set; }
        [ForeignKey("PatientId")]
        [InverseProperty("PatientProblems")]
        public virtual RegPatient Patient { get; set; }
    }
}
