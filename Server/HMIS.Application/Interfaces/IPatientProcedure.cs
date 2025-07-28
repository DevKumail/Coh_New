using HMIS.Data.Models;
using HMIS.Service.DTOs.Clinical;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.Implementations
{
    public interface IPatientProcedure
    {

        Task<DataSet> GetAllPatientProcedure(string MRNo);
        Task<bool> InsertOrUpdatePatientProcedure(PatientProcedureModel patientProcedure);

        Task<bool> DeletePatientProcedure(long Id);
        Task<DataSet> GetProcedureList(long Id, string ProcedureStartCode, string ProcedureEndCode, string DescriptionFilter);
        Task<DataSet> GetChargeCaptureProcedureList(long Id, string ProcedureStartCode, string ProcedureEndCode, string DescriptionFilter, long ProcedureTypeId);

    }
}
