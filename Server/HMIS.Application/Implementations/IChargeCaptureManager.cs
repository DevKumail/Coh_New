using HMIS.Core.Entities;
using HMIS.Application.DTOs.ChargeCaptureDTOs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.Implementations
{
    public interface IChargeCaptureManager
    {
        Task<DataSet> CC_MyCptCodeGetDB(long ProviderId, long? GroupId, long? PayerId);
        Task<DataSet> CC_MyDiagnosisCodeDB(long ProviderId, long? GroupId, long? ICDVersionId);
        Task<DataSet> CC_DiagnosisCodeDB(int? ICDVersionId, string? DiagnosisStartCode, string? DiagnosisEndCode, string? DescriptionFilter, int? @PageNumber, int? PageSize);
        Task<DataSet> CC_CPTCodeDB(int? AllCPTCode, string? CPTStartCode, string? CPTEndCode, string? Description);
        Task<DataSet> CC_MyDentalCodeDB(long ProviderId, long? GroupId, string? ProviderDescription, string? DentalCode, long? PayerId);
        Task<DataSet> CC_DentalCodeDB(int? AllDentalCode, string? DentalStartCode, string? DentalEndCode, string? DescriptionFilter);
        Task<DataSet> CC_MyHCPCSCodeDB(long ProviderId, long? GroupId, string? HCPCSCode, string? DescriptionFilter, long? PayerId);
        Task<DataSet> CC_HCPCSCodeDB(int? AllHCPCSCode, string? HCPCStartCode, string? HCPCSEndCode, string? DescriptionFilter);
        Task<DataSet> CC_UnclassifiedServiceDB(int? AllCode, string? UCStartCode, string? DescriptionFilter);
        Task<DataSet> CC_ServiceItemsDB(int? AllCode, string? ServiceStartCode, string? DescriptionFilter);
        Task<bool> InsertMyDiagnosisCodeGridDB(List<BLSuperBillDiagnosis> bl);
        Task<bool> InsertAllGridDB(List<BLSuperBillProcedure> sb);
        Task<DataSet> CC_GridDataDB(long VisitAccountNo);
        Task<List<Blicd9cmgroup>> GetICD9CMGroupByProvider(long? Id);

        Task<String> SaveChargeCapture(ChargCaptureModel input);
        Task<string> UpdateMyDiagnosisDB(List<BLSuperBillDiagnosis> bl);
        Task<string> UpdateMyProcedureDB(List<BLSuperBillProcedure> sb);
        Task<List<Blcptgroup>> GetCPTByProvider(long? Id);
        Task<DataSet> CC_LoadAllGroupsAndCodes(long? GroupId, long? ProviderId, long? PayerId);
    }
}
