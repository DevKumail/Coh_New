using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.ChargeCaptureDTOs
{
    public class BLSupperBillDiagnosisModel
    {

        public long DiagnosisId { get; set; }
        public long VisitAccountNo { get; set; }


        public string Icd9code { get; set; }

        public DateTime? LastUpdatedDate { get; set; }

        public string LastUpdatedBy { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public string DiagnosisPriority { get; set; }

        public string DiagnosisType { get; set; }
        public bool? Confidential { get; set; }

        public bool? IsHl7msgCreated { get; set; }

        public int? Icdorder { get; set; }

        public string Type { get; set; }

        public string Descriptionshort { get; set; }

        public long? IcdversionId { get; set; }

        public string YearofOnset { get; set; }
    }

    public class ChargCaptureModel
    {
        public long VisitAccountNo { get; set; }
        public string MrNo { get; set; }
        public long EmployeeId { get; set; }
        public int AppointmentId { get;set; }
        public string Comment { get; set; }
        public List<BLSupperBillDiagnosisModel> BLSupperBillDiagnosisModel { get; set; }
        public List<BlSuperBillProcedureModel> blSuperBillProcedureModel { get; set; }

    }
}
