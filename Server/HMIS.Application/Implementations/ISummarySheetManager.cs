using HMIS.Application.DTOs;
using HMIS.Application.DTOs.Clinical;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.Implementations
{
    public interface ISummarySheetManager
    {
        //Task<bool> VitalSignsInsert(Vital vs);

        //Vital Signs

        Task<DataSet> GetAllVitalSigns(long MRNo, long VisitAccountNo);
        Task<DataSet> GetVitalSigns(long id, long VisitAccountNo);
        Task<bool> VSInsert(VitalSign vitalSigns);
        Task<bool> VSUpdate(VitalSign vitalSigns);


        Task<DataSet> SS_GetMedicationsList(long MRNo);

        Task<DataSet> SS_GetPatientAllergies(long MRNo);

        Task<DataSet> SS_GetMedicalHistory(long MRNo, int? PageNumber, int? PageSize);

        Task<DataSet> SS_GetPatientProblem(long MRNo, int? PageNumber, int? PageSize);

        Task<DataSet> SS_GetPatientProcedure(int? status, long MRNo, int? PageNumber, int? PageSize);

        Task<DataSet> SS_GetPatientImmunization(long MRNo);

    }
}
