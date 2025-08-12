using HMIS.Core.Entities;
using HMIS.Application.DTOs.BillGeneratorDTOs;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.Implementations
{
    public interface IBillGeneratorManager
    {

        Task<DataSet> GetDiagnosis(long VisitAccountNo);
        Task<DataSet> GetDiagnosisDelete(long VisitAccountNo);
        Task<DataSet> GetProcedures(long VisitAccountNo);
        string GetChargeCaptureComments(long VisitAccountNo);
        Task<DataSet> DeleteDiagnosis(long DiagnosisId, long VisitAccountNo, string IcdCode, string loginUser);
    }
}
