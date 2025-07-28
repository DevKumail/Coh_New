using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.DTOs.ChargeCaptureDTOs
{
    public class BLSuperBillDiagnosis
    {
        public long? DiagnosisId { get; set; }
        public long VisitAccountNo { get; set; }
        public string ICD9Code { get; set; }
        public DateTime? LastUpdatedDate { get; set; }
        public string LastUpdatedBy { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string DiagnosisPriority { get; set; }
        public string DiagnosisType { get; set; }
        public bool? Confidential { get; set; }
        public bool? IsHL7MsgCreated { get; set; }
        public int? ICDOrder { get; set; }
        public string Type { get; set; }
        public string DescriptionShort { get; set; }
        public long? ICDVersionId { get; set; }
        public string YearOfOnset { get; set; }
    }
}
