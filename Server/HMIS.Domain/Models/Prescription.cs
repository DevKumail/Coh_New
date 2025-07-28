using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("Prescription")]
    public partial class Prescription
    {
        [Key]
        public long MedicationId { get; set; }
        public long? ProviderId { get; set; }
        [Column("MRNo")]
        [StringLength(10)]
        [Unicode(false)]
        public string Mrno { get; set; }
        public long? AppointmentId { get; set; }
        public long? DrugId { get; set; }
        [StringLength(110)]
        [Unicode(false)]
        public string Rx { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string Dose { get; set; }
        [StringLength(20)]
        [Unicode(false)]
        public string Route { get; set; }
        [StringLength(20)]
        [Unicode(false)]
        public string Frequency { get; set; }
        public int? Duration { get; set; }
        [StringLength(20)]
        [Unicode(false)]
        public string Dispense { get; set; }
        [StringLength(10)]
        [Unicode(false)]
        public string Quantity { get; set; }
        public bool IsRefill { get; set; }
        [StringLength(20)]
        [Unicode(false)]
        public string AdditionalRefills { get; set; }
        [StringLength(14)]
        [Unicode(false)]
        public string PrescriptionDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? StartDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? StopDate { get; set; }
        [StringLength(20)]
        [Unicode(false)]
        public string Samples { get; set; }
        [StringLength(200)]
        [Unicode(false)]
        public string Instructions { get; set; }
        [StringLength(200)]
        [Unicode(false)]
        public string Indications { get; set; }
        [StringLength(200)]
        [Unicode(false)]
        public string Comments { get; set; }
        [StringLength(25)]
        [Unicode(false)]
        public string UpdateBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdateDate { get; set; }
        [Column("GCN_SEQNO")]
        [StringLength(20)]
        [Unicode(false)]
        public string GcnSeqno { get; set; }
        public bool IsActive { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string Status { get; set; }
        [StringLength(100)]
        [Unicode(false)]
        public string StatusReason { get; set; }
        public Guid? SendToLabId { get; set; }
        [Column("NDC")]
        [StringLength(20)]
        [Unicode(false)]
        public string Ndc { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ReviewedDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ReviewedBy { get; set; }
        public long? ParentMedicationId { get; set; }
        public int? OriginalRefillCount { get; set; }
        [StringLength(500)]
        public string AlertOverrideReason { get; set; }
        [StringLength(100)]
        public string OutSideClinicProviderName { get; set; }
        public bool? IsSigned { get; set; }
        [Column("oldMRNo")]
        [StringLength(20)]
        [Unicode(false)]
        public string OldMrno { get; set; }
        [Column("MedicationGivenByID")]
        public long? MedicationGivenById { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? GivenDate { get; set; }
        [Column("MedicationCheckedByID")]
        public long? MedicationCheckedById { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CheckedDate { get; set; }
        public bool IsSubmitted { get; set; }
        public int? SubmissionBatchId { get; set; }
        [Column("ErxID")]
        [StringLength(15)]
        [Unicode(false)]
        public string ErxId { get; set; }
        [Column("DhpoRouteID")]
        [StringLength(10)]
        [Unicode(false)]
        public string DhpoRouteId { get; set; }
        public int? EncounterType { get; set; }
        public bool? IsInternal { get; set; }
        public int? PharmacyEmailId { get; set; }
        public byte PickupTypeId { get; set; }
        public bool? IsDeleted { get; set; }
        [StringLength(200)]
        public string OutsideClinic { get; set; }

        [ForeignKey("AppointmentId")]
        [InverseProperty("Prescriptions")]
        public virtual SchAppointment Appointment { get; set; }
        [ForeignKey("DrugId")]
        [InverseProperty("Prescriptions")]
        public virtual TabDrugsName Drug { get; set; }
        [ForeignKey("ProviderId")]
        [InverseProperty("Prescriptions")]
        public virtual Hremployee Provider { get; set; }
    }
}
