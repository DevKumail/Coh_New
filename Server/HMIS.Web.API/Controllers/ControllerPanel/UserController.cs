using HMIS.Infrastructure.Logger;
using HMIS.Application.DTOs.ControlPanel;
using HMIS.Application.Implementations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using static HMIS.Application.DTOs.SpLocalModel.UserListModel;

namespace HMIS.API.Controllers.ControllerPanel
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : BaseApiController
    {
        private readonly IUserManager _userManager;
        public UserController(IUserManager userManager)
        {
            _userManager = userManager;
        }

        [HttpPost("SaveLicense")]
        public async Task<IActionResult> InsertLicense(HrlicenseInfo license)
        {
            try
            {

                //string name =   User.Claims.Where(a => a.Type == "UserName").FirstOrDefault().Value;
                var result = await _userManager.InsertLicense(license);

                if (result)
                {
                    return Ok(new { Success = true });
                }
                else
                {
                    return Ok(new { Success = false });

                }

            }
            catch (Exception ex)
            {
                return StatusCode(500);
            }
        }

        [HttpPost("InsertUsers")]
        public async Task<IActionResult> InsertUsers(Hremployee employee)
        {

            //FILE BASED
            //NLogHelper.WriteLog(new LogParameter() { Message = "Insert user", ActionDetails = $"Insert User", ActionId = 1, ActionTime = DateTime.Now, FormName = "Insert User", ModuleName = "UserController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"Insert user > object  = {employee.ToString()}");




            //  long employeeId = Convert.ToInt64(User.Claims.Where(c => c.Type == "UserId")
            //                .First().Value);

            try
            {
                employee.CreatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;

                foreach (var EmployeeFacility in employee.EmployeeFacility)
                {
                    EmployeeFacility.CreatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;
                }

                foreach (var EmployeeRole in employee.EmployeeRole)
                {
                    EmployeeRole.CreatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;
                }

                //foreach (var LicenseInfo in employee.LicenseInfo)
                //{
                //    LicenseInfo.CreatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;
                //}




                //     employee.EmployeeId = employeeId;

                var result = await _userManager.InsertUserDB1(employee);


                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = "Insert user", ActionDetails = $"Insert User", ActionId = 1, ActionTime = DateTime.Now, FormName = "Insert User", ModuleName = "UserController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"Insert user > result  = {result}");


                if (result != null)
                {
                    return Ok(new { Success = true });
                }

                return BadRequest(result);
            }
            catch(Exception ex)
            {
                return null;

            }
        }
           [HttpGet("{EmployeeId}")]
            public async Task<IActionResult> GetUsersByID(long EmployeeId)
            {


                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = "GetUsersByID", ActionDetails = $"GetUsersByID", ActionId = 1, ActionTime = DateTime.Now, FormName = "GetUsersByID", ModuleName = "UserController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"GetUsersByID > Id  = {EmployeeId}");


                DataSet result = await _userManager.GetUserByIDDB(EmployeeId);



                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = "GetUsersByID", ActionDetails = $"GetUsersByID", ActionId = 1, ActionTime = DateTime.Now, FormName = "GetUsersByID", ModuleName = "UserController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"GetUsersByID > data is empty?  = {result.Tables.Count == 0}");



                if (result != null)
                {
                    return Ok(result);
                }

                return BadRequest(result);
            }




            [HttpGet("GetLicense/{HRlicenseID}")]
            public async Task<IActionResult> GetLicenseByID(long HRlicenseID)
            {


                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = "GetLicenseByID", ActionDetails = $"GetUsersByID", ActionId = 1, ActionTime = DateTime.Now, FormName = "GetLicense", ModuleName = "UserController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"GetLicense > Id  = {HRlicenseID}");


                DataSet result = await _userManager.GetLicenseByID(HRlicenseID);



                if (result != null)
                {
                    return Ok(result);
                }

                return BadRequest(result);

            }


            [HttpGet("GetHREmployeeTypes")]
            public async Task<IActionResult> GetHREmployeeTypes()
            {



                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = "SearchUsers", ActionDetails = $"SearchUsers", ActionId = 1, ActionTime = DateTime.Now, FormName = "SearchUsers", ModuleName = "UserController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"SearchUsers > params  = {FullName}, {Gender}, {Phone},  {CellNo},  {JoiningDate},  {Email}, {EmployeeType}");



                DataSet result = await _userManager.GetHREmployeeTypesDataSet();



                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = "SearchUsers", ActionDetails = $"SearchUsers", ActionId = 1, ActionTime = DateTime.Now, FormName = "SearchUsers", ModuleName = "UserController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"SearchUsers > params  = {FullName}, {Gender}, {Phone},  {CellNo},  {JoiningDate},  {Email}, {EmployeeType}");


                if (result != null)
                {
                    return Ok(result);
                }

                return BadRequest(result);
            }



            [HttpGet("FilterUsers")]
            public async Task<IActionResult> FilterUsers(string? FullName, string? Gender, string? Phone, string? CellNo, DateTime? JoiningDate, string? Email, int? EmployeeType, int? Page, int? Size)
            {



                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = "SearchUsers", ActionDetails = $"SearchUsers", ActionId = 1, ActionTime = DateTime.Now, FormName = "SearchUsers", ModuleName = "UserController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"SearchUsers > params  = {FullName}, {Gender}, {Phone},  {CellNo},  {JoiningDate},  {Email}, {EmployeeType}");



                DataSet result = await _userManager.FilterUsersDb(FullName, Gender, Phone, CellNo, JoiningDate, Email, EmployeeType, Page, Size);



                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = "SearchUsers", ActionDetails = $"SearchUsers", ActionId = 1, ActionTime = DateTime.Now, FormName = "SearchUsers", ModuleName = "UserController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"SearchUsers > params  = {FullName}, {Gender}, {Phone},  {CellNo},  {JoiningDate},  {Email}, {EmployeeType}");


                if (result != null)
                {
                    return Ok(result);
                }

                return BadRequest(result);
            }

            [HttpGet("List")]
            public async Task<IActionResult> SearchUsers(string? FullName, string? Gender, string? Phone, string? CellNo, DateTime? JoiningDate, string? Email, int? EmployeeType, bool? Active, bool? isRefProvider, bool? IsEmployee, int? facilityId, int? Page, int? Size, string? SortColumn, string? SortOrder)
            {




                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = "SearchUsers", ActionDetails = $"SearchUsers", ActionId = 1, ActionTime = DateTime.Now, FormName = "SearchUsers", ModuleName = "UserController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"SearchUsers > params  = {FullName}, {Gender}, {Phone},  {CellNo},  {JoiningDate},  {Email}, {EmployeeType}");



                DataSet result = await _userManager.SearchUserDB(FullName, Gender, Phone, CellNo, JoiningDate, Email, EmployeeType, Active, isRefProvider, IsEmployee, facilityId, Page, Size, SortColumn, SortOrder);



                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = "SearchUsers", ActionDetails = $"SearchUsers", ActionId = 1, ActionTime = DateTime.Now, FormName = "SearchUsers", ModuleName = "UserController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"SearchUsers > params  = {FullName}, {Gender}, {Phone},  {CellNo},  {JoiningDate},  {Email}, {EmployeeType}");


                if (result != null)
                {
                    return Ok(result);
                }

                return BadRequest(result);
            }

            [HttpPut("{UpdateByEmployeeId}")]
            public async Task<IActionResult> UpdateUsers(Hremployee hremp)
            {

                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = "UpdateUsers", ActionDetails = $"UpdateUsers", ActionId = 1, ActionTime = DateTime.Now, FormName = "UpdateUsers", ModuleName = "UserController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"UpdateUsers > params  = {hremp.ToString()}");




                //long employeeId = Convert.ToInt64(User.Claims.Where(c => c.Type == "UserId")
                //                .First().Value);

                hremp.CreatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;

                foreach (var EmployeeFacility in hremp.EmployeeFacility)
                {
                    EmployeeFacility.UpdatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;
                }

                foreach (var EmployeeRole in hremp.EmployeeRole)
                {
                    EmployeeRole.UpdatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;
                }

                //foreach (var LicenseInfo in hremp.LicenseInfo)
                //{
                //    LicenseInfo.UpdatedB = User.Claims.Where(c => c.Type == "UserName").First().Value;
                //}
                // hremp.EmployeeId = employeeId;

                string result = await _userManager.UpdateUserDB(hremp);



                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = "UpdateUsers", ActionDetails = $"UpdateUsers", ActionId = 1, ActionTime = DateTime.Now, FormName = "UpdateUsers", ModuleName = "UserController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"UpdateUsers > result  = {result}");


                if (result == "OK")
                {
                    return Ok();
                }

                return BadRequest(result);

            }




            [HttpDelete("Delete/{EmployeeId}")]
            public async Task<IActionResult> Delete(long employeeId)
            {

                //FILE BASED
                bool result = await _userManager.Delete(employeeId);



                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = "Delete", ActionDetails = $"Delete", ActionId = 1, ActionTime = DateTime.Now, FormName = "UpdateUsers", ModuleName = "UserController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"Delete > result  = {result}");


                if (result)
                {
                    return Ok(new { Success = true });
                }

                return BadRequest(result);

            }




            [HttpDelete("DeleteLicense/{HRlicenseID}")]
            public async Task<IActionResult> DeleteLicense(long HRlicenseID)
            {

                //FILE BASED
                bool result = await _userManager.DeleteLicense(HRlicenseID);



                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = "DeleteLicense", ActionDetails = $"DeleteLicense", ActionId = 1, ActionTime = DateTime.Now, FormName = "UpdateUsers", ModuleName = "UserController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"DeleteLicense > result  = {result}");


                if (result)
                {
                    return Ok(new { Success = true });
                }

                return BadRequest(result);

            }
            [HttpPost("SearchUserDBWithpagination")]
            public async Task<IActionResult> SearchUserDBWithpagination(FilterUserList req)
            {
                //SearchUserDBWithpagination(FilterUserList req){
                var result = await _userManager.SearchUserDBWithpagination(req);
                if (result != null)
                {
                    return Ok(new { result });
                }
                return Ok(null);
            }
    }
}
