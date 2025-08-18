using HMIS.Infrastructure.Logger;
using HMIS.Application.DTOs.ControlPanel;
using HMIS.Application.Implementations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace HMIS.Web.Controllers.ControllerPanel
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WelcomeController : BaseApiController
    {
        private readonly IWelcomeScreenManager _welocmeManager;
        public WelcomeController(IWelcomeScreenManager welocmeManager)
        {
            _welocmeManager = welocmeManager;
        }

        [HttpGet("GetTaskToDo")]
        public async Task<IActionResult> GetTaskToDo(long receiverId, int receiverRoleId, string facilityId = "1", int pageNumber = 1, int pageSize = 10)
        {


            //FILE BASED
            //NLogHelper.WriteLog(new LogParameter() { Message = "GetTaskToDo", ActionDetails = $"GetTaskToDo", ActionId = 1, ActionTime = DateTime.Now, FormName = "GetTaskToDoBy{receiverId}", ModuleName = "WelcomeController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"GetTaskToDo > param  = {receiverId},{receiverRoleId}");


            DataSet result = await _welocmeManager.TaskToDoGetDB(receiverId, receiverRoleId, facilityId, pageNumber, pageSize);



            //FILE BASED
            //NLogHelper.WriteLog(new LogParameter() { Message = "GetTaskToDo", ActionDetails = $"GetTaskToDo", ActionId = 1, ActionTime = DateTime.Now, FormName = "GetUsersByID", ModuleName = "WelcomeController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"GetTaskToDoByParameters > data is empty?  = {result.Tables.Count == 0}");




            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }



        [HttpGet("GetPersonalReminders")]
        public async Task<IActionResult> GetPersonalReminders(long employeeId, int pageNumber = 1, int pageSize = 10, string sortColumn = "ReminderDateTime", string sortOrder = "DESC")
        {


            //FILE BASED
            //NLogHelper.WriteLog(new LogParameter() { Message = "GetPersonalReminders", ActionDetails = $"GetPersonalReminders", ActionId = 1, ActionTime = DateTime.Now, FormName = "GetPersonalReminders", ModuleName = "WelcomeController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"GetPersonalReminderByID > Id  = {employeeId}");


            DataSet result = await _welocmeManager.PersonalRemindersGetDB(employeeId, pageNumber, pageSize, sortColumn, sortOrder);



            //FILE BASED
            //NLogHelper.WriteLog(new LogParameter() { Message = "GetPersonalReminders", ActionDetails = $"GetPersonalReminders", ActionId = 1, ActionTime = DateTime.Now, FormName = "GetPersonalReminders", ModuleName = "WelcomeController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"GetPersonalReminderByID > data is empty?  = {result.Tables.Count == 0}");




            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet("GetSchAppointmentsLoad")]
        public async Task<IActionResult> GetSchAppointmentsLoad(DateTime fromDate, DateTime toDate, long providerId = 0, int siteId = 0, string facilityId = "1", int pageNumber = 1, int pageSize = 10, string sortColumn = "ReminderDateTime", string sortOrder = "DESC")
        {


            //FILE BASED
            //NLogHelper.WriteLog(new LogParameter() { Message = "GetSchAppointmentsLoad", ActionDetails = $"GetSchAppointmentsLoad", ActionId = 1, ActionTime = DateTime.Now, FormName = "GetSchAppointmentsLoad", ModuleName = "WelcomeController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"SchAppointmentsLoad > param  = {fromDate},{toDate},{providerId}, {siteId}, {facilityId}");


            DataSet result = await _welocmeManager.SchAppointmentsLoadDB(fromDate, toDate, providerId, siteId, facilityId, pageNumber, pageSize);



            //FILE BASED
            //NLogHelper.WriteLog(new LogParameter() { Message = "GetSchAppointmentsLoad", ActionDetails = $"GetSchAppointmentsLoad", ActionId = 1, ActionTime = DateTime.Now, FormName = "GetSchAppointmentsLoad", ModuleName = "WelcomeController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, $"SchAppointmentsLoad > data is empty?  = {result.Tables.Count == 0}");




            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }




        [HttpPost("InsertPersonalReminder")]
        public async Task<IActionResult> InsertReminder(PersonalReminder reminder)
        {
            try
            {

                bool res = await _welocmeManager.InsertReminderDB(reminder.EmployeeId, reminder.ReminderText, reminder.ReminderDateTime, reminder.CreatedBy);

                if (res)
                {
                    return Ok(res);
                }
                else
                {
                    return BadRequest("Unable to insert reminder");
                }
            }
            catch (Exception ex)
            {
                // Log the exception here
                return StatusCode(500, "An error occurred while inserting the reminder");
            }
        }


        [HttpPut("UpdatePersonalReminder")]
        public async Task<IActionResult> UpdateReminder(int reminderId, int employeeId, string reminderText, DateTime reminderDateTime, string updatedBy)
        {
            try
            {

                bool res = await _welocmeManager.UpdatePersonalReminderDB(reminderId, employeeId, reminderText, reminderDateTime, updatedBy);

                if (res)
                {
                    return Ok(res);
                }
                else
                {
                    return BadRequest("Unable to Update reminder");
                }
            }
            catch (Exception ex)
            {
                // Log the exception here
                return StatusCode(500, "An error occurred while Updating the reminder");
            }
        }

        [HttpDelete("DeletePersonalReminder")]
        public async Task<IActionResult> DeleteReminder(int reminderId)
        {
            try
            {

                var res = await _welocmeManager.DeletePersonalReminderDB(reminderId);

                if (res)
                {
                    return Ok(res);
                }
                else
                {
                    return BadRequest("Unable to delete record");
                }
            }
            catch (Exception ex)
            {
                // Log the exception here
                return StatusCode(500, "An error occurred while Deleting the reminder");
            }
        }
    }
}
