using HMIS.Data.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static HMIS.Service.DTOs.SpLocalModel.UserListModel;

namespace HMIS.Service.Implementations
{
    public interface IUserManager
    {
        Task<bool> InsertLicense(DTOs.ControlPanel.HrlicenseInfo license);
        Task<bool> InsertUserDB(DTOs.ControlPanel.Hremployee hremployee);

        Task<string> InsertUserDB1(DTOs.ControlPanel.Hremployee hremployee);

        Task<DataSet> GetUserByIDDB(long EmployeeId);
        Task<DataSet> SearchUserDB(string? FullName, string? Gender, string? Phone, string? CellNo, DateTime? JoiningDate, string? Email, int? EmployeeType, bool? Active, bool? isRefProvider, bool? IsEmployee, int? facilityId, int? Page = 1, int? Size = 100, string? SortColumn = "EmployeeId", string? SortOrder = "ASC");

        Task<DataSet> FilterUsersDb(string? FullName, string? Gender, string? Phone, string? CellNo, DateTime? JoiningDate, string? Email, int? EmployeeType, int? Page = 1, int? Size = 100);

        Task<DataSet> GetHREmployeeTypesDataSet();
        Task<bool> Delete(long employeeId);
        Task<bool> DeleteLicense(long HRlicenseID);
        Task<string> UpdateUserDB(DTOs.ControlPanel.Hremployee hremp);
        Task<DataSet> GetLicenseByID(long HRlicenseID);
        Task<DataSet> SearchUserDBWithpagination(FilterUserList req);
    }
}
