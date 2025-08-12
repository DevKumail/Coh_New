
using HMIS.Core.Entities;
using HMIS.Application.DTOs.ControlPanel;
using HMIS.Application.Implementations;
using HMIS.Application.ServiceLogics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Drawing;

namespace HMIS.API.Controllers.ControllerPanel
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RoleController : BaseApiController
    {
        private readonly IRoleManager _roleManager;
        private readonly IPermissionService _permissionService;


        public RoleController(IRoleManager roleManager, IPermissionService permissionService)
        {
            _roleManager = roleManager;
            _permissionService = permissionService;
        }
        [HttpPost]
        public async Task<IActionResult> InsertRoles(HMIS.Application.DTOs.ControlPanel.SecRole secrole)
        {
            secrole.CreatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;

            foreach (var secPrivilege in secrole.SecPrivilegesAssignedRoleList)
            {
                secPrivilege.CreatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;
            }

            foreach (var secroleformlist in secrole.SecRoleFormList)
            {
                secroleformlist.CreatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;
            }



            var result = await _roleManager.InsertRoleDB(secrole);

            if (result)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }


        [HttpGet("{RoleId}")]
        public async Task<IActionResult> GetRoleByID(long RoleId)
        {


            DataSet result = await _roleManager.GetRoleByIDDB(RoleId);


            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet("GetAllRoles")]
        public async Task<IActionResult> GetAllRoles()
        {


            DataSet result = await _roleManager.GetAllRoles();


            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet("GetDetailsByRoleId/{roleId}")]
        public async Task<IActionResult> GetDetailsByRoleId(long roleId)
        {


            DataSet result = await _roleManager.GetFormAndModuleDetailsByRoleId(roleId);


            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet]
        public async Task<IActionResult> SearchRole(string? RoleName, bool? IsActive, int? Page, int? Size, string? SortColumn, string? SortOrder)
        {
            DataSet result = await _roleManager.SearchRoleDB(RoleName, IsActive, Page, Size, SortColumn, SortOrder);

            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);


        }

        [HttpPut("{UpdateByRoleId}")]
        public async Task<IActionResult> UpdateRole(HMIS.Application.DTOs.ControlPanel.SecRole secrole)
        {

            secrole.CreatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;

            foreach (var secPrivilege in secrole.SecPrivilegesAssignedRoleList)
            {
                secPrivilege.UpdatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;
            }

            foreach (var secroleformlist in secrole.SecRoleFormList)
            {
                secroleformlist.UpdatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;
            }
            var result = await _roleManager.UpdateRoleDB(secrole);

            if (result)
            {
                return Ok(result);
            }

            return BadRequest(result);

        }
        [HttpGet("GetModuleAndForm/{empTypeId}")]
        public async Task<IActionResult> GetModuleAndForm(int empTypeId)
        {

            try
            {
                var result = await _roleManager.GetModuleAndFormDetails(empTypeId);

                return Ok(result);
            }
            catch (Exception ex)
            {

                throw;
            }

        }

        [HttpPost("AssignRoleAndModules")]
        public async Task<IActionResult> AssignRoleAndModules(HMIS.Application.DTOs.ControlPanel.RolesDto role)
        {

            try
            {
                var result = await _roleManager.AssignRoles(role);

                return Ok(result);
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }



        [HttpGet("GetModulesDetail")]
        public async Task<IActionResult> GetModulesDetail()
        {
            try
            {

                var result = await _roleManager.GetAllModulesList();


                return Ok(result);
            }
            catch (Exception ex)
            {

                throw;
            }

        }
         

        [HttpGet("GetPermissionTree")]
        public async Task<IActionResult> GetPermissionTree()
        {
            try
            {
                long employeeId = Convert.ToInt64(User.Claims.Where(c => c.Type == "UserId")
                   .First().Value);


                string userName = User.Claims.Where(c => c.Type == "UserName").First().Value;
                  
                var permissionsTree = await _permissionService.GetPermissionTreeByEmpIdandUserId(employeeId, userName);
                 

                string treeJsons = "";
                if (permissionsTree != null)
                {
                    if (permissionsTree.Count > 0)
                    {
                        treeJsons = Newtonsoft.Json.JsonConvert.SerializeObject(permissionsTree);
                    }
                }

                return Ok(new { Success = true, Tree = treeJsons });
            }
            catch (Exception ex)
            {

                throw;
            }



        }












    }
}
