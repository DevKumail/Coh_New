using Dapper;
using HMIS.Infrastructure.Helpers;
using HMIS.Infrastructure.ORM;
using HMIS.Core.Entities;
using HMIS.Application.DTOs;
using HMIS.Application.DTOs.ControlPanel;
using HMIS.Application.DTOs.PermissionDTOs;
using HMIS.Application.Implementations;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.ServiceLogics
{
    public class RoleManager : IRoleManager
    {
        private readonly HmisContext _context;


        public RoleManager( HmisContext context)
        {
            _context = context;

        }

        public async Task<bool> InsertRoleDB(HMIS.Application.DTOs.ControlPanel.SecRole secrole)
        {
            try

            {
                DataTable SecRoleFormDT = ConversionHelper.ToDataTable(secrole.SecRoleFormList);

                DataTable SecPrivilegesAssignedRoleDT = ConversionHelper.ToDataTable(secrole.SecPrivilegesAssignedRoleList);

                HMIS.Application.DTOs.ControlPanel.SecRole role = new HMIS.Application.DTOs.ControlPanel.SecRole();

                role = secrole;

                DynamicParameters parameters = new DynamicParameters();


                parameters.Add("@RoleName", role.RoleName, DbType.String);

                parameters.Add("@IsActive", role.IsActive, DbType.Boolean);

                parameters.Add("@CreatedBy", role.CreatedBy, DbType.String);

                parameters.Add("@SecRoleFormTypeVar", SecRoleFormDT, DbType.Object);

                parameters.Add("@SecPrivilegesAssignedRoleTypeVar", SecPrivilegesAssignedRoleDT, DbType.Object);


                bool res = await DapperHelper.ExcecuteSPByParams("CP_InsertRole", parameters);


                return res;




            }
            catch (Exception ex)
            {
                return false;
            }

        }

        public async Task<bool> AssignRoles(HMIS.Application.DTOs.ControlPanel.RolesDto role)
        {
            try
            {
                var assignedRole = _context.SecPrivilegesAssignedRoles.Where(x => x.RoleId == role.RoleId).ToList();

                var SecRoleForm = _context.SecRoleForms.Where(x => x.RoleId == role.RoleId).ToList();
                 
                if (assignedRole.Count!=0)
                {
                    foreach (var itemPrivilige in assignedRole)
                    {
                        itemPrivilige.IsDeleted = true;

                        _context.SecPrivilegesAssignedRoles.Update(itemPrivilige);
                    }
                    await _context.SaveChangesAsync();

                }

                if(SecRoleForm.Count!=0)
                {
                    foreach (var itemRole in SecRoleForm)
                    {
                        itemRole.IsDeleted = true;
                        _context.SecRoleForms.Update(itemRole);

                    }

                    await _context.SaveChangesAsync();

                } 

                List<AssignRoleDto> rolesDtos = new List<AssignRoleDto>();
                HMIS.Application.DTOs.ControlPanel.RolesDto roleDto = new HMIS.Application.DTOs.ControlPanel.RolesDto();


                HashSet<int> uniqueFormIds = new HashSet<int>();
                foreach (var item in role.AssignedRoleList)
                {
                     uniqueFormIds.Add(item.FormId.Value);
                }

                foreach (int formId in uniqueFormIds)
                {
                    if (!_context.SecRoleForms.Any(rf => rf.RoleId == role.RoleId.Value && rf.FormId == formId))
                    {
                        HMIS.Core.Entities.SecRoleForm secRole = new Core.Entities.SecRoleForm();
                        secRole.FormId = formId;
                        secRole.RoleId = role.RoleId.Value;
                        secRole.CreatedOn = DateTime.Now;

                        _context.SecRoleForms.Add(secRole);
                    }
                }

                await _context.SaveChangesAsync();

                foreach (var item in role.AssignedRoleList)
                {

                    //var formPriviligeId = _context.SecPrivilegesAvailableForms
                    //    .Where(x=>x.FormId==item.FormId && x.PrivilegeId==item.PrivilegeId && x.IsDeleted==false).Select(x=>x.FormPrivilegeId).FirstOrDefault(); 
                    var formPrivilige = _context.SecPrivilegesAvailableForms.FirstOrDefault(x => x.FormId == item.FormId &&
                         x.PrivilegeId == item.PrivilegeId);
                    HMIS.Core.Entities.SecPrivilegesAssignedRole assignRole = new Core.Entities.SecPrivilegesAssignedRole();

                    if (formPrivilige != null)
                    {
                        int formPrivilegeId = formPrivilige.FormPrivilegeId;
                        
                        assignRole.FormPrivilegeId = formPrivilegeId;
                        assignRole.RoleId = role.RoleId.Value;
                        assignRole.CreatedOn = DateTime.Now;
                        assignRole.IsDeleted = false;

                        _context.SecPrivilegesAssignedRoles.Add(assignRole);


                    }
                     
                    
                }
                await _context.SaveChangesAsync();

 
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }












        public async Task<DataSet> GetRoleByIDDB(long RoleId)
        {
            try
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@RoleId", RoleId, DbType.Int64);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("CP_GetRoleById", parameters);

                if (ds.Tables[0].Rows.Count == 0)
                {
                    return new DataSet();
                }

                return ds;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }
        }




        public async Task<DataSet> GetModuleAndFormDetails(int userId)
        {
            try
            {
                DynamicParameters parameters = new DynamicParameters();

                var isAdmin = _context.HremployeeTypes.Where(x => x.TypeDescription == "Administrator").Select(x => x.TypeId).FirstOrDefault();


                if (isAdmin == userId)
                {
                    DataSet ds = await DapperHelper.GetDataSetBySPWithParams("LoadModuleAndFormDetails", parameters);

                    if (ds.Tables[0].Rows.Count == 0)
                    {
                        return new DataSet();
                    }

                    return ds;
                }
                else
                {
                    return new DataSet();
                }
            }


            catch (Exception ex)
            {
                return new DataSet();
            }
        }



        public async Task<DataSet> GetAllModulesList()
        {
            try
            {
                var modules = _context.SecModules.Where(x=>x.IsDeleted==false)
                                  .Select(x => new { x.ModuleId, x.ModuleName }).ToList();

                DataTable table = new DataTable();
                table.Columns.Add("ModuleId", typeof(long));
                table.Columns.Add("ModuleName", typeof(string));

                foreach (var module in modules)
                {
                    table.Rows.Add(module.ModuleId, module.ModuleName);
                }

                DataSet dataSet = new DataSet();
                dataSet.Tables.Add(table);

                return dataSet;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }
        }

        public async Task<DataSet> GetFormAndModuleDetailsByRoleId(long roleId)
        {
            try
            {

                DynamicParameters param = new DynamicParameters();
                DataSet ds = new DataSet();

                param.Add("@RoleId", roleId, DbType.Int64);

                ds = await DapperHelper.GetDataSetBySPWithParams("GetFormAndModulePermissionsByRoleId", param);
                if (ds.Tables[0].Rows.Count == 0)
                {
                    throw new Exception("No data exist");
                }
 
                return ds;

            }
            catch (Exception ex)
            {
                return new DataSet();
            }


        }


        public async Task<DataSet> GetAllRoles()
        {
            try
            {
                var roles = _context.SecRoles.Where(x => x.IsDeleted == false)
                       .Select(x => new { RoleId = x.RoleId, RoleName = x.RoleName })
                       .ToList();
 
                DataSet dataSet = new DataSet();

                DataTable dataTable = new DataTable("Roles");

                dataTable.Columns.Add("RoleId", typeof(int));
                dataTable.Columns.Add("RoleName", typeof(string));

                foreach (var item in roles)
                {
                    dataTable.Rows.Add(item.RoleId, item.RoleName);
                }

                dataSet.Tables.Add(dataTable);

                return dataSet;
                
            }
            catch (Exception ex)
            {
                return new DataSet();
            }

        }


        public async Task<DataSet> SearchRoleDB(string? RoleName, bool? IsActive, int? Page = 1, int? Size = 100, string? SortColumn = "RoleId", string? SortOrder = "ASC")
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@RoleName", RoleName, DbType.String);

                param.Add("@IsActive", IsActive, DbType.Boolean);
                param.Add("@IsActive", IsActive, DbType.Boolean);
                param.Add("@Page", Page, DbType.Int64);
                param.Add("@Size", Size, DbType.Int64);
                param.Add("@SortColumn", SortColumn, DbType.String);
                param.Add("@SortOrder", SortOrder, DbType.String);


                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("CP_SearchRole", param);
                if (ds.Tables[0].Rows.Count == 0)
                {
                    return new DataSet();
                }

                return ds;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }

        }

        public async Task<bool> UpdateRoleDB(HMIS.Application.DTOs.ControlPanel.SecRole secrole)
        {

            DataTable SecRoleFormDT = ConversionHelper.ToDataTable(secrole.SecRoleFormList);

            DataTable SecPrivilegesAssignedRoleDT = ConversionHelper.ToDataTable(secrole.SecPrivilegesAssignedRoleList);
            try
            {
                Core.Entities.Hremployee EMP = new Core.Entities.Hremployee();

                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@RoleId", secrole.RoleId, DbType.Int64);

                parameters.Add("@RoleName", secrole.RoleName, DbType.String);

                parameters.Add("@IsActive", secrole.IsActive, DbType.Boolean);

                parameters.Add("@UpdatedBy", secrole.UpdatedBy, DbType.String);

                parameters.Add("@SecRoleFormTypeVar", SecRoleFormDT, DbType.Object);

                parameters.Add("@SecPrivilegesAssignedRoleTypeVar", SecPrivilegesAssignedRoleDT, DbType.Object);

                bool res = await DapperHelper.ExcecuteSPByParams("CP_UpdateRole", parameters);

                if (res == true)
                {
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                return false;

            }




        }

    }
}
