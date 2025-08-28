using HMIS.Application.DTOs.Registration;
using HMIS.Application.Implementations;
using HMIS.Application.ServiceLogics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Configuration;
using System.Data;
using System.IO;
using HMIS.Application.DTOs.SpLocalModel;

namespace HMIS.Web.Controllers.Registration
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TempDemographicController : BaseApiController
    {
        private readonly ITempDemographicManager _tempDemographicManager;
        private readonly IConfiguration _configuration;
        TimerElapsed timerElapsed = new TimerElapsed();
        public TempDemographicController(ITempDemographicManager tempDemographicManager)
        {
            _tempDemographicManager = tempDemographicManager;
        }

        [HttpGet("GetTempDemographics_new")]
        public async Task<IActionResult> TempDemographics(long? TempId, string? Name, string? Address, int? PersonEthnicityTypeId, string? Mobile, string? DOB, string? Gender, int? Country, int? State, int? City, string? ZipCode, int? InsuredId, int? CarrierId, int? Page, int? Size, string? SortColumn, string? SortOrder)
        {

            DataSet result = await _tempDemographicManager.TempDemoDB(TempId, Name, Address, PersonEthnicityTypeId, Mobile, DOB, Gender, Country, State, City, ZipCode, InsuredId, CarrierId,Page,Size,SortColumn,SortOrder);
             

            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        [HttpGet("GetTempDemographicsByTempId")]
        public async Task<IActionResult> GetTempDemoById(string TempId)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = "PatientId:" + TempId;
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                DataSet result = await _tempDemographicManager.GetTempDemoByTempId(TempId);
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

        [HttpPost("InsertTempPatientRecord")]
        public async Task<IActionResult> InsertTempDemographic(RegTempPatient regTempInsert)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();
            var requestMessage = JsonConvert.SerializeObject(regTempInsert);
            double elapsed = 0;
            timerElapsed.StartTimer();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                if (regTempInsert.TempId > 0)
                {
                    regTempInsert.UpdatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;

                    var result = await _tempDemographicManager.UpdateTempDemoDB(regTempInsert);

                    if (result)
                    {
                        return Ok(new { Success = true });
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
                else
                {
                    regTempInsert.CreatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;

                    var result = await _tempDemographicManager.InsertTempDemoDB(regTempInsert);

                    if (result)
                    {
                        return Ok(new { Success = true });
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

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }



        }

        //[HttpPut("UpdateTempPatientRecord")]
        //public async Task<IActionResult> UpdateTempDemographic(RegTempPatient regTempUpdate)
        //{
        //    regTempUpdate.UpdatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;

        //    var result = await _tempDemographicManager.UpdateTempDemoDB(regTempUpdate);

        //    if (result)
        //    {
        //        return Ok(new { Success = true });
        //    }

        //    return BadRequest(result);
        //}
        [HttpDelete("deleteTempDemographicByTemptId")]
        public async Task<IActionResult> deletetempdemographics(int TempId)
        {

            var result = await _tempDemographicManager.DeleteTempDemographicDB(TempId);

            if (result)
            {
                return Ok(new { Success = true });
            }

            return BadRequest(result);

        }
        [HttpPost("GetTempDemographics_new_with_pagination")]
        public async Task<IActionResult> TempDemoDB_with_pagination([FromBody] TempDemographicList req)
        {

            DataSet result = await _tempDemographicManager.TempDemoDB_with_pagination(req);

            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}