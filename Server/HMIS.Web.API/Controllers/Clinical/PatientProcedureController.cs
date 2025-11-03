using HMIS.Application.DTOs.Clinical;
using HMIS.Application.Implementations;
using HMIS.Application.ServiceLogics;
using HMIS.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;

namespace HMIS.Web.Controllers.Clinical
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientProcedureController : BaseApiController
    {

        private readonly IPatientProcedure patientProcedure;
        TimerElapsed timerElapsed = new TimerElapsed();


        public PatientProcedureController(IPatientProcedure patientProcedure)
        {
            this.patientProcedure = patientProcedure;

        }
    

        [HttpGet("GetPatientProcedure")]
        public async Task<ActionResult> GetPatientProcedure(string MRNo)
        {
            var patient = await patientProcedure.GetAllPatientProcedure(MRNo);
            return Ok(new { patient = patient });
        }

        [HttpPost("InsertOrUpdatePatientProcedure")]
        public async Task<ActionResult> InsertOrUpdatePatientProcedure(PatientProcedureModel pat)
        {
            try
            {
                bool success = await patientProcedure.InsertOrUpdatePatientProcedure(pat);

                if (success)
                {
                    return Ok(new { message = "Patient Procedure created or updated successfully." });
                }
                else
                {
                    return BadRequest(new { message = "Failed to create or update Patient Procedure." });
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing the request.", error = ex.Message });
            }
        }


        [HttpDelete("DeletePatientProcedure")]
        public async Task<ActionResult> DeletePatientProcedure(long Id)
        {
            var patient = await patientProcedure.DeletePatientProcedure(Id);
            return Ok(new { message = "Patient Procedure Deleted Successfully" });

            //  return Ok(new { patient = patient });
        }


        //[HttpGet("GetProcedureList")]

        //public async Task<ActionResult> GetProcedureList(
        //    [FromQuery] int? PageNumber,
        //    [FromQuery] int? PageSize,
        //    [FromQuery] string? ProcedureStartCode,
        //    [FromQuery] string? ProcedureEndCode,
        //    [FromQuery] string? DescriptionFilter)
        //{
        //    var patient = await patientProcedure.GetProcedureList(PageNumber, PageSize, ProcedureStartCode, ProcedureEndCode, DescriptionFilter);
        //    return Ok(new { procedures = patient });
        //    //  return Ok(new { patient = patient });
        //}



        #region GetProcedureList
        [HttpGet("GetProcedureList")]
        public async Task<IActionResult> GetProcedureList(string? ProcedureStartCode, string? ProcedureEndCode, string? DescriptionFilter, int? PageNumber, int? PageSize)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = "ProcedureStartCode:" + ProcedureStartCode + "\nProcedureEndCode:" + ProcedureEndCode + "\nDescriptionFilter:" + DescriptionFilter;
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                DataSet result = await patientProcedure.GetProcedureList(ProcedureStartCode, ProcedureEndCode, DescriptionFilter, PageNumber, PageSize);

                elapsed = timerElapsed.StopTimer();
                if (result != null)
                {
                    var statusCode = HttpContext.Response.StatusCode;
                    var responseMessage = JsonConvert.SerializeObject(result);
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information("HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed} ms - Request: {RequestMessage}, Response: {ResponseMessage}",
        method, path, statusCode, elapsed, requestMessage, responseMessage);
                    return Ok(result);
                }
                else
                {
                    var statusCode = HttpContext.Response.StatusCode;
                    var responseMessage = JsonConvert.SerializeObject(result);
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information("HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed} ms - Request: {RequestMessage}, Response: {ResponseMessage}",
        method, path, statusCode, elapsed, requestMessage, responseMessage);
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                var statusCode = HttpContext.Response.StatusCode;
                var responseMessage = JsonConvert.SerializeObject(ex.Message);
                var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                logger.Information("HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed} ms - Request: {RequestMessage}, Response: {ResponseMessage}",
    method, path, statusCode, elapsed, requestMessage, responseMessage);
                return BadRequest(ex.Message);
            }

        }
        #endregion







        [HttpGet("GetChargeCaptureProcedureList")]

        public async Task<ActionResult> GetChargeCaptureProcedureList(long Id, string ProcedureStartCode, string ProcedureEndCode, string DescriptionFilter, long ProcedureTypeId)
        {
            var patient = await patientProcedure.GetChargeCaptureProcedureList(Id, ProcedureStartCode, ProcedureEndCode, DescriptionFilter,ProcedureTypeId);
            return Ok(new { procedures = patient });
            //  return Ok(new { patient = patient });
        }
    }
}
