using HMIS.Application.DTOs.AppointmentDTOs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.Implementations
{
    public interface IEligibilityManager
    {
        Task<DataSet> GetEligibilityLogDetailsDB(long mrno);
        Task<(List<string> columnNames, List<object[]> columnValues)> InsertEligibilityLog(long appid);
        Task<(List<string> columnNames, List<object[]> columnValues)> Get270fileInfoByAppId(long appId);
       void Gen270File(string subscriberName, string subsciberName2, string claimLicenseNo, string facilityEligInfo, string payerCode, string insuredNo, string ssnNo, string birthDate, long insertedRowId);
    }
}
