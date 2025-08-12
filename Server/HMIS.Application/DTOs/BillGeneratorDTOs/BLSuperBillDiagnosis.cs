using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.DTOs.BillGeneratorDTOs
{
    public class BLSuperBillDiagnosis
    {
        public long DiagnosisId { get; set; }
        public long VisitAccountNo { get; set; }
        public string ICD9Code { get; set; }
        public DateTime LastUpdatedDate { get; set; }
        public string LastUpdatedBy { get; set; }
        public string Priority { get; set; }
        public string DescriptionShort { get; set; }
    }
}
