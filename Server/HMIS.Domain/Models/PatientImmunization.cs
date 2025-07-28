using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HMIS.Data.Models
{
    [Table("PatientImmunization")]
    public partial class PatientImmunization
    {
        [Key]
        public long Id { get; set; }
        public long? AppointmentId { get; set; }
        public long? DrugTypeId { get; set; }
        public long? ProviderId { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? StartDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? EndDate { get; set; }
        [StringLength(200)]
        [Unicode(false)]
        public string Comments { get; set; }
        public byte? Status { get; set; }
        public bool Active { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string ManufacturerName { get; set; }
        [StringLength(20)]
        [Unicode(false)]
        public string LotNumber { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ExpiryDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? InjectionDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? NextInjectionDate { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string SiteInjection { get; set; }
        public long? UpdatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime UpdatedDate { get; set; }
        [Column("MRNo")]
        [StringLength(10)]
        [Unicode(false)]
        public string Mrno { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string DrugName { get; set; }
        public long? RouteId { get; set; }
        [Column("VISDate", TypeName = "datetime")]
        public DateTime? Visdate { get; set; }
        [StringLength(50)]
        [Unicode(false)]
        public string ProviderName { get; set; }
        [StringLength(100)]
        [Unicode(false)]
        public string ErrorReason { get; set; }
        [StringLength(30)]
        [Unicode(false)]
        public string Dose { get; set; }
        [Column("oldMRNo")]
        [StringLength(20)]
        [Unicode(false)]
        public string OldMrno { get; set; }
        public bool? IsDeleted { get; set; }
        public long CreatedBy { get; set; }
        public long? ImmTypeId { get; set; }
        [StringLength(200)]
        public string OutsideClinic { get; set; }

        [ForeignKey("AppointmentId")]
        [InverseProperty("PatientImmunizations")]
        public virtual SchAppointment Appointment { get; set; }
        [ForeignKey("CreatedBy")]
        [InverseProperty("PatientImmunizationCreatedByNavigations")]
        public virtual Hremployee CreatedByNavigation { get; set; }
        [ForeignKey("DrugTypeId")]
        [InverseProperty("PatientImmunizationDrugTypes")]
        public virtual ImmunizationList DrugType { get; set; }
        [ForeignKey("ImmTypeId")]
        [InverseProperty("PatientImmunizationImmTypes")]
        public virtual ImmunizationList ImmType { get; set; }
        [ForeignKey("ProviderId")]
        [InverseProperty("PatientImmunizationProviders")]
        public virtual Hremployee Provider { get; set; }
        [ForeignKey("RouteId")]
        [InverseProperty("PatientImmunizations")]
        public virtual Emrroute Route { get; set; }
        [ForeignKey("UpdatedBy")]
        [InverseProperty("PatientImmunizationUpdatedByNavigations")]
        public virtual Hremployee UpdatedByNavigation { get; set; }
    }
}
