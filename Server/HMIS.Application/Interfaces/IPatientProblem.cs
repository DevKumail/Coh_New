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
    public interface IPatientProblem
    {
        //Task<List<PatientProblem>> GetAllPatientProblems(string MRNo, long UserId);
        //   Task<PatientProblem> GetPatientProblem(long id);
        Task<DataSet> GetAllPatientProblems(string MRNo, long UserId);
        Task<bool> InsertOrUpdatePatientProblem(PatientProblemModel patientProblem);

        Task<bool> DeletePatientProblem(long Id);
      //  Task<bool> UpdatePatientProblem(PatientProblem patientProblem);
    }
}
