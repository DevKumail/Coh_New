using HMIS.Service.DTOs.PermissionDTOs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.Implementations
{
    public interface IPermissionService
    {
        Task<DataSet> GetPermissionDataSetByEmpIdandUserId(long empId, string username);
        Task<PermissionResponseModel> GetPermissionByEmpIdandUserId(long empId, string username, DataSet dataSet = null);
        Task<List<PermissionTree>> GetPermissionTreeByEmpIdandUserId(long empId, string username);
    }
}
