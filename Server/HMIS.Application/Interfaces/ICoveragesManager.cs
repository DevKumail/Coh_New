using HMIS.Service.DTOs.Coverage;
using HMIS.Service.DTOs.SpLocalModel;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.Implementations
{
    public interface ICoveragesManager
    {
        Task<DataSet> GetCoveragesList(CoverageList req);
        Task<DataSet> GetSearchDB(Byte? CompanyOrIndividual, string? LastName, string? SSN, string? InsuredIDNo, string? MRNo, int PageNumber, int PageSize);
        Task<DataSet> GetBLEligibilityLogsDB(string? MRNo, long? VisitAccountNo, int? EligibilityId, int? ELStatusId, string? MessageRequestDate, string? MessageResponseDate);
        Task<DataSet> GetSubcriberDetailsDB(string InsuredIDNo);
        Task<DataSet> GetCoverageDB(long subscribedId);
        Task<string> InsertSubscriberDB(InsuranceSubscriber regInsert);
        Task<string> UpdateSubscriberDB(InsuranceSubscriber regUpdate);
        Task<InsurenceEligibility> ReadImage(IFormFile imageFile, long PayerId);

        Task<object> GetInsuranceRelation();
    }
}
