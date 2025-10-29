using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static HMIS.Application.DTOs.SpLocalModel.DemographicListModel;

namespace HMIS.Application.Implementations
{
    public interface ICommonManager
    {
        Task<DataSet> GetFamilyByMRNoDB(string MRNo);
        Task<DataSet> GetCoverageAndRegPatientDB(FilterDemographicList req);
        Task<DataSet> GetCoverageAndRegPatientDBByMrNo(string MRNo);
        Task<DataSet> GetRegPatientDB();
        Task<DataSet> GetInsurrancePayerInfo(long MRNo);
        Task<DataSet> GetDemographicDB(string VisitAccountDisplay);
        Task<DataSet> GetAppointmentDetailsByMRNo(int? PageNumber, int? PageSize, string MRNo);
    }
}
