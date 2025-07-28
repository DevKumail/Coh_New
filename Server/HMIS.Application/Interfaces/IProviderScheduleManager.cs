using HMIS.Service.DTOs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static HMIS.Service.DTOs.SpLocalModel.ProviderScheduleModel;

namespace HMIS.Service.Implementations
{
    public interface IProviderScheduleManager
    {
        Task<DataSet> GetProviderFacilityDB(long ProviderId);
        Task<DataSet> GetProviderSiteDB(int FacilityId);
        Task<DataSet> GetProviderScheduleListDB(FilterProviderScheduleListRequest request);
        Task<DataSet> GetProviderScheduleDB(long ProviderId, int SiteId, int FacilityId, int UsageId);
        Task<DataSet> GetProviderSingleScheduleDB(long PSId);
        Task<bool> InsertProviderScheduleDB(ProviderSchedule ps);
        Task<bool> UpdateProviderScheduleDB(ProviderSchedule ps);
        Task<bool> DeleteProviderSchedule(long PSId);
        Task<bool> UpdatePriority(List<PrioritySet> prioritySet);
       // Task<DataSet> GetViewPatientDB(int? MRNo, string? PatientName, DateTime? AppDate, string? AppType, int? PatientStatus);
        Task<DataSet> GetViewPatientStatusDB(int? MRNo);

        Task<object> GetDurationOfTimeSlot(int SiteId, int ProviderId, int FacilityId, string Days);

    }
}
