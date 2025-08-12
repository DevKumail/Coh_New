using HMIS.Application.DTOs.Registration;
using HMIS.Application.DTOs.SpLocalModel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.Implementations
{
    public interface ITempDemographicManager
    {
        Task<DataSet> TempDemoDB(long? TempId, string? Name, string? Address, int? PersonEthnicityTypeId, string? Mobile, string? DOB, string? Gender, int? Country, int? State, int? City, string? ZipCode, int? InsuredId, int? CarrierId, int? Page, int? Size, string? SortColumn, string? SortOrder);
        Task<bool> InsertTempDemoDB(RegTempPatient reg);
        Task<bool> UpdateTempDemoDB(RegTempPatient reg);
        Task<DataSet> GetTempDemoByTempId(string TempId);
        Task<bool> DeleteTempDemographicDB(int TempId);
        Task<DataSet> TempDemoDB_with_pagination(TempDemographicList req);
    }
}