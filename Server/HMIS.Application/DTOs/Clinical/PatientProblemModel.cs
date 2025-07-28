using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.Clinical
{
    public class PatientProblemModel
    {
        public long Id { get; set; }
        public long? AppointmentId { get; set; }
        public string Icd9 { get; set; }
        public string Icd9description { get; set; }
        public string Comments { get; set; }
        public long? ProviderId { get; set; }
/*        public string StartDate { get; set; }
        public string EndDate { get; set; }*/
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public byte Status { get; set; }
        public bool Active { get; set; }
        public long UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string Mrno { get; set; }
        public long? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string DiagnosisPriority { get; set; }
        public string DiagnosisType { get; set; }
        public bool Confidential { get; set; }
        public bool? IsHl7msgCreated { get; set; }
        public bool? IsMedicalHistory { get; set; }
        public Guid? CaseId { get; set; }
        public string ErrorReason { get; set; }
        public string OldMrno { get; set; }
        public int? IcdversionId { get; set; }
        public bool IsDeleted { get; set; }
        public long? PatientId { get; set; }

        public string Startstrdate { get; set;}
        public string Endstrdate { get; set;} 

        public string providerDescription { get; set; } 

    }
}
