using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.Clinical
{
    public class PatientProcedureModel
    {
        public long Id { get; set; }

        public long? ProviderId { get; set; }

        public string Cptcode { get; set; }

        public string ProcedureDescription { get; set; }

        public DateTime? ProcedureDateTime { get; set; }

        public string Comments { get; set; }
        public int Active { get; set; }

        public long? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public string Mrno { get; set; }

        public long? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public long? ProcedureType { get; set; }

        public string ProcedurePriority { get; set; }

        public string AssociatedDiagnosisCode { get; set; }

        public DateTime? ProcedureEndDateTime { get; set; }

        public string PrimaryAnestheticId { get; set; }

        public string TypeOfAnesthesia { get; set; }

        public DateTime? AnesthesiaStartDateTime { get; set; }

        public DateTime? AnesthesiaEndDateTime { get; set; }

        public bool? PerformedOnFacility { get; set; }

        public bool? IsHl7msgCreated { get; set; }
        public bool? IsLabTest { get; set; }

        public string ErrorReason { get; set; }
        public string providerDescription { get; set; }

        public string OldMrno { get; set; }
        public bool? IsDeleted { get; set; }
        public long? AppointmentId { get; set; }
    }
}
