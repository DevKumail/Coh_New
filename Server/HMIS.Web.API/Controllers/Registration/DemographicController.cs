using HMIS.Core.Entities;
using HMIS.Application.DTOs.Registration;
using HMIS.Application.Implementations;
using HMIS.Application.ServiceLogics;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Configuration;
using System.Data;
using System.IO;
using System.Reflection.Emit;
using System.Security.Policy;
using static HMIS.Application.DTOs.SpLocalModel.DemographicListModel;

namespace HMIS.Web.Controllers.Registration
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize]

    public class DemographicController : BaseApiController
    {
        #region Fields
        private readonly IDemographicManager _demographicManager;
        private readonly IConfiguration _configuration;
        TimerElapsed timerElapsed = new TimerElapsed();
        #endregion
        #region Ctor
        public DemographicController(IDemographicManager demographicManager, IConfiguration configuration)
        {
            _configuration = configuration;
            _demographicManager = demographicManager;
        }
        #endregion
        #region Methods

        #region GetDemographics
        [HttpGet("GetDemographics")]
        public async Task<IActionResult> GetDemoByMRNo(string MRNo)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = "MRNo:" + MRNo;
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                DataSet result = await _demographicManager.GetDemoByMRNoDB(MRNo);
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

        #region GetPatientHistory
        [HttpGet("GetPatientHistory")]
        public async Task<IActionResult> GetPatientHistoryByMRNo(string MRNo)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();
            var requestMessage = "MRNo:" + MRNo;
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                DataSet result = await _demographicManager.GetHistoryByMRNoDB(MRNo);
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
            //table1 = REG_GetUniquePatientOld

        }
        #endregion

        #region InsertPatientRecord
        [HttpPost("InsertPatientRecord")]
        public async Task<IActionResult> InsertDemographic(RegInsert reg)
            {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()

    .AddJsonFile("appsettings.json")
    .Build();
            var requestMessage = JsonConvert.SerializeObject(reg);
            double elapsed = 0;
            timerElapsed.StartTimer();  
            if (!ModelState.IsValid)
            {
                elapsed = timerElapsed.StopTimer();
                var statusCode = HttpContext.Response.StatusCode;
                var responseMessage = JsonConvert.SerializeObject("Not Valid Call!");
                var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                logger.Information("HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed} ms - Request: {RequestMessage}, Response: {ResponseMessage}",
    method, path, statusCode, elapsed, requestMessage, responseMessage);
                return BadRequest(ModelState);
            }
            try
            {
                if (reg.PatientId > 0)
                {
                    reg.UpdatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;
                    var result = await _demographicManager.UpdateDemographicDB(reg);
                    elapsed = timerElapsed.StopTimer();
                    if (result)
                    {
                        var statusCode = HttpContext.Response.StatusCode;
                        var responseMessage = JsonConvert.SerializeObject(result);
                        var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                        logger.Information("HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed} ms - Request: {RequestMessage}, Response: {ResponseMessage}",
            method, path, statusCode, elapsed, requestMessage, responseMessage);
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
                    //reg.CreatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;
                    var result = await _demographicManager.InsertDemographicDB(reg);
                    elapsed = timerElapsed.StopTimer();
                    if (result)
                    {
                        var statusCode = HttpContext.Response.StatusCode;
                        var responseMessage = JsonConvert.SerializeObject(result);
                        var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                        logger.Information("HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed} ms - Request: {RequestMessage}, Response: {ResponseMessage}",
            method, path, statusCode, elapsed, requestMessage, responseMessage);
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
                //   return null;
            }
            catch (Exception ex)
            {
                elapsed = timerElapsed.StopTimer();
                var statusCode = HttpContext.Response.StatusCode;
                var responseMessage = JsonConvert.SerializeObject(ex.Message);
                var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                logger.Information("HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed} ms - Request: {RequestMessage}, Response: {ResponseMessage}",
    method, path, statusCode, elapsed, requestMessage, responseMessage);
                return BadRequest(ex.Message);
            }

        }
        #endregion

        #region Updated Call
        //[HttpPut("UpdatePatientRecordByPatientID")]
        //public async Task<IActionResult> UpdateDemographic(RegInsert regUpdate)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }
        //    //regUpdate.UpdatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;

        //    var result = await obj.UpdateDemographicDB(regUpdate);

        //    if (result)
        //    {
        //        return Ok(new { Success = true });
        //    }

        //    return BadRequest(result);
        //}

        #endregion


        [HttpDelete("deletedemographicByPatientId")]
        public async Task<IActionResult> deletedemographics(int PatientId)
        {

            var result = await _demographicManager.DeleteDemographicDB(PatientId);

            if (result)
            {
                return Ok(new { Success = true });
            }

            return BadRequest(result);

        }




        #region GetDemographicsById
        [HttpGet("GetDemographicsById")]
        public async Task<IActionResult> GetDemoById(string PatientId)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = "PatientId:" + PatientId;
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                DataSet result = await _demographicManager.GetDemoByPatientId(PatientId);
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




        [HttpPost("GetAllDemographicsData")]
        public async Task<IActionResult> GetAllDemographicsData([FromBody] FilterDemographicList req)
        {
            //table1 = REG_GetUniquePatientOld

            //MRNo = MRNo == "-1" ? string.Empty : MRNo;
            DataSet result = await _demographicManager.GetAllDemographicsData(req);


            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        #endregion
    }
}
