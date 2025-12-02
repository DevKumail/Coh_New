using HMIS.Core.Entities;
using HMIS.Application.DTOs.AppointmentDTOs;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HMIS.Application;
using HMIS.Application.DTOs.Clinical;
using static HMIS.Application.DTOs.AppointmentDTOs.SpLocalModel.SchAppointmentIWithFilter;
using Microsoft.AspNetCore.Mvc;

namespace HMIS.Application.Implementations
{
    public interface IAppointmentManager
    {
        Task<DataSet> SearchAppointmentDB(
            DateTime? FromDate,
             DateTime? ToDate,
             int? ProviderID,
             int? LocationID,
             int? SpecialityID,
             int? SiteID,
             int? FacilityID,
             int? ReferredProviderId,
             long? PurposeOfVisitId,
             int? AppTypeId,
             int? VisitTypeId,
             string? LastUpdatedBy,
             //[FromQuery(Name = "ids")] 
             [FromQuery] List<int>? AppStatusIds,
             bool? ShowScheduledAppointmentOnly,
             int? Page, int? Size);

        Task<DataSet> DashboardSearchAppointmentDB(
           DateTime? FromDate,
            DateTime? ToDate,
            int? ProviderID,
            int? LocationID,
            int? SpecialityID,
            int? SiteID,
            int? FacilityID,
            int? ReferredProviderId,
            long? PurposeOfVisitId,
            int? AppTypeId,
            int? VisitTypeId,
            string? LastUpdatedBy,
            //[FromQuery(Name = "ids")] 
            [FromQuery] List<int>? AppStatusIds,
            bool? ShowScheduledAppointmentOnly,
            int? Page, int? Size);
        Task<DataSet> GetAppointmentDetailsDB(long VisitAccountNo);
        Task<DataSet> GetViewAppointmentDetailsDB(ViewAppointments view);
        Task<bool> InsertAppointmentDB(HMIS.Application.DTOs.AppointmentDTOs.SchAppointmentModel schApp);
        Task<bool> UpdateAppointmentDB(HMIS.Application.DTOs.AppointmentDTOs.SchAppointmentModel schApp);
        Task<DataSet> SearchAppointmentHistoryDB(string MRNo, int? ProviderId, int? PatientStatusId, int? AppStatusId, int? Page, int? Size);
        Task<bool> CancelOrRescheduleAppointmentDB(long AppId, int AppStatusId, bool ByProvider, int? RescheduledId);
        Task<DataSet> ValidateAppointmentDB(HMIS.Application.DTOs.AppointmentDTOs.SchAppointmentModel sa);
        Task<DataSet> ValidateCheckInDB(long AppId);
        Task<bool> AppointmentStatus(long appId, int appStatusId, int appVisitId);

        Task<bool> UpdateRescheduleAppointmentDB(SchRescheduleAppointments schReschedule);
        Task<DataSet> SpeechtoText(int? MRNo, int? PageNumber, int? PageSize);

        //Task<bool> InsertSpeech(ClinicalNoteDto sp);  
        Task<SchAppointmentModel> GetAppoimentForEditById(long appId);

        Task<object> GetTimeSlotbySiteId(int SiteId);
        Task<List<VwSpecialitybyFacilityid>> GetVwSpecialitybyFacilityid(int FacilityId);

        Task<List<VwSitebySpecialityid>> GetSitebySpecialityId(int SpecialtyId);
        Task<List<VwProviderbySiteid>> GetProviderbySiteId(int SiteId);
        Task<List<VwProviderByFacilityId>> GetProviderByFacilityId(int FacilityId);
        Task<List<VwSpecialityByEmployeeId>> GetSpecialityByEmployeeId(int EmployeeId);
        Task<List<VwSiteByproviderId>> GetSiteByproviderId(int providerId);
        Task<object> GetTimeSlots(int SiteId, int ProviderId, int FacilityId, string Days);
        Task<object> GetSchAppointmentList(int? SiteId, int? ProviderId, int? FacilityId, int? SpecialityId, string? Date);

        //Task<string> AddBLPatientVisit(BlPatientVisitModel req);
        Task<DataSet> SearchAppointmentDBWithPagination(SchAppointmentIWithFilterRequest req);

        //Task<bool> InsertSpeech(ClinicalNoteObj note);

    }
}