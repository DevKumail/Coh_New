using HMIS.Application.DTOs.ControlPanel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.Implementations
{
    public interface IRoleManager
    {
        Task<bool> InsertRoleDB(HMIS.Application.DTOs.ControlPanel.SecRole secrole);
        Task<DataSet> GetRoleByIDDB(long RoleId);
        Task<DataSet> GetAllRoles();
        Task<DataSet> SearchRoleDB(string? RoleName, bool? IsActive, int? Page = 1, int? Size = 100, string? SortColumn = "RoleId", string? SortOrder = "ASC");
        Task<bool> UpdateRoleDB(HMIS.Application.DTOs.ControlPanel.SecRole secrole);

        Task<DataSet> GetAllModulesList();

        Task<DataSet> GetFormAndModuleDetailsByRoleId(long roleId);

        //Task<DataSet> GetModuleAndFormDetails();

        Task<DataSet> GetModuleAndFormDetails(int empTypeId);
        Task<bool> AssignRoles(HMIS.Application.DTOs.ControlPanel.RolesDto role);
    }
}
