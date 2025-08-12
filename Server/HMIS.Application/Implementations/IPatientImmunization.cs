using HMIS.Application.DTOs.Clinical;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.Implementations
{
    public interface IPatientImmunization
    {
        Task<DataSet> GetAllPatientImmunization(string mrno);
        Task<bool> InsertOrUpdatePatientImmunization(PatientImmunizationModel patientImmunization);
        Task<bool> DeletePatientImmunization(long Id);
          
    }  
}
