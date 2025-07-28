using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static HMIS.Service.DTOs.SpLocalModel.DemographicListModel;

namespace HMIS.Service.Implementations
{
    public interface ICommonManager
    {
        Task<DataSet> GetFamilyByMRNoDB(string MRNo);
        Task<DataSet> GetCoverageAndRegPatientDB(FilterDemographicList req);
        Task<DataSet> GetCoverageAndRegPatientDBByMrNo(string MRNo);
        Task<DataSet> GetRegPatientDB();
        Task<DataSet> GetInsurrancePayerInfo(long MRNo);
        Task<DataSet> GetDemographicDB(string VisitAccountDisplay);
        Task<DataSet> GetAppointmentDetailsByMRNo(string MRNo);
    }
}
