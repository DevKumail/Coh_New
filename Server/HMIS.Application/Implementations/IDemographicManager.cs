using HMIS.Application.DTOs.Registration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static HMIS.Application.DTOs.SpLocalModel.DemographicListModel;

namespace HMIS.Application.Implementations
{
    public interface IDemographicManager
    {
        Task<DataSet> GetDemoByMRNoDB(string MRNo);
        Task<DataSet> GetHistoryByMRNoDB(string MRNo);

        Task<bool> DeleteDemographicDB(int PatientId);
        Task<bool> UpdateDemographicDB(RegInsert regUpdate);
        Task<bool> InsertDemographicDB(RegInsert regInsert);
        Task<DataSet> GetDemoByPatientId(string PatientId);
        Task<DataSet> GetAllDemographicsData(FilterDemographicList req);
    }
}
