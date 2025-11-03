using HMIS.Core.Entities;
using HMIS.Application.DTOs.Clinical;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.Implementations
{
    public interface IPatientProcedure
    {

        Task<DataSet> GetAllPatientProcedure(string MRNo);
        Task<bool> InsertOrUpdatePatientProcedure(PatientProcedureModel patientProcedure);

        Task<bool> DeletePatientProcedure(long Id);
        //Task<DataSet> GetProcedureList(int? PageNumber, int? PageSize, string? ProcedureStartCode, string? ProcedureEndCode, string? DescriptionFilter);
        Task<DataSet> GetProcedureList(string? ProcedureStartCode, string? ProcedureEndCode, string? DescriptionFilter, int? PageNumber, int? PageSize);

        Task<DataSet> GetChargeCaptureProcedureList(long Id, string ProcedureStartCode, string ProcedureEndCode, string DescriptionFilter, long ProcedureTypeId);

    }
}
