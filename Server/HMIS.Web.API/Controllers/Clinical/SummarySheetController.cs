using HMIS.Core.Entities;
using HMIS.Application.DTOs;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.Implementations;
using HMIS.Application.ServiceLogics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Newtonsoft.Json;
using NuGet.ContentModel;
using System.Data;

namespace HMIS.Web.Controllers.Clinical
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SummarySheetController : BaseApiController
    {
        #region Fields
        private readonly ISummarySheetManager _summarySheetManager;
        TimerElapsed timerElapsed = new TimerElapsed();
        #endregion

        #region ctor
        public SummarySheetController(ISummarySheetManager summarySheetManager)
        {
            this._summarySheetManager = summarySheetManager;
        }
        #endregion

        #region Methods
        [HttpGet("GetSummarySheet")]
        public async Task<IActionResult> GetSummarySheet(long MRNo = 0, long VisitAccountNo = 0)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            var requestMessage = "MRNo: " + ((MRNo != 0 ? MRNo : 0)) + ", VisitAccountNo: " + ((VisitAccountNo != 0 ? VisitAccountNo : 0));
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                //VitalSigns
                DataSet result = await _summarySheetManager.GetAllVitalSigns(MRNo, VisitAccountNo);

                if (result != null)
                {
                    var statusCode = HttpContext.Response.StatusCode;
                    var responseMessage = JsonConvert.SerializeObject(new { VitalSigns = result.Tables[0] });
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information($"HTTP {method} {path} responded {statusCode} in {elapsed} ms - Request : {requestMessage}, Response : {responseMessage}");

                    return Ok(new { VitalSigns = result.Tables[0] });
                }
                else
                {
                    var statusCode = HttpContext.Response.StatusCode;
                    var responseMessage = JsonConvert.SerializeObject(result);
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information($"HTTP {method} {path} responded {statusCode} in {elapsed} ms - Request : {requestMessage}, Response : {responseMessage}");
                    return BadRequest(new { VitalSigns = result.Tables[0] });
                }
            }
            catch (Exception ex)
            {
                var statusCode = HttpContext.Response.StatusCode;
                var responseMessage = JsonConvert.SerializeObject(ex.Message);
                var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                logger.Information($"HTTP {method} {path} responded {statusCode} in {elapsed} ms - Request : {requestMessage}, Response : {responseMessage}");
                return BadRequest(ex.Message);
            }
        }

        #region VitalSigns CRUD Methods

        [HttpGet("VitalSignGet")]
        public async Task<IActionResult> VitalSignGet(long ID , long VisitAccountNo )
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            var requestMessage = "ID: " + ((ID != 0 ? ID : 0)) + ", VisitAccountNo: " + ((VisitAccountNo != 0 ? VisitAccountNo : 0));
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                //VitalSigns
                DataSet result = await _summarySheetManager.GetVitalSigns(ID, VisitAccountNo);

                if (result != null)
                {
                    var statusCode = HttpContext.Response.StatusCode;
                    var responseMessage = JsonConvert.SerializeObject(result);
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information($"HTTP {method} {path} responded {statusCode} in {elapsed} ms - Request : {requestMessage}, Response : {responseMessage}");

                    return Ok(new { VitalSign = result.Tables[0] });
                }
                else
                {
                    var statusCode = HttpContext.Response.StatusCode;
                    var responseMessage = JsonConvert.SerializeObject(result);
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information($"HTTP {method} {path} responded {statusCode} in {elapsed} ms - Request : {requestMessage}, Response : {responseMessage}");
                    return BadRequest(new { VitalSign = result.Tables[0] });
                }
            }
            catch (Exception ex)
            {
                var statusCode = HttpContext.Response.StatusCode;
                var responseMessage = JsonConvert.SerializeObject(ex.Message);
                var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                logger.Information($"HTTP {method} {path} responded {statusCode} in {elapsed} ms - Request : {requestMessage}, Response : {responseMessage}");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("VitalSignInsert")]
        public async Task<IActionResult> VitalSignInsert(VitalSign vitalSigns)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            var requestMessage = "VitalSigns: " + vitalSigns;
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                //VitalSignsInsert
                bool result = await _summarySheetManager.VSInsert(vitalSigns);

                if (result == true)
                {
                    var statusCode = HttpContext.Response.StatusCode;
                    var responseMessage = JsonConvert.SerializeObject(result);
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information($"HTTP {method} {path} responded {statusCode} in {elapsed} ms - Request : {requestMessage}, Response : {responseMessage}");

                    return Ok(new { Success = true });
                }
                else
                {
                    var statusCode = HttpContext.Response.StatusCode;
                    var responseMessage = JsonConvert.SerializeObject(result);
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information($"HTTP {method} {path} responded {statusCode} in {elapsed} ms - Request : {requestMessage}, Response : {responseMessage}");
                    return BadRequest(new { Success = false });
                }
            }
            catch (Exception ex)
            {
                var statusCode = HttpContext.Response.StatusCode;
                var responseMessage = JsonConvert.SerializeObject(ex.Message);
                var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                logger.Information($"HTTP {method} {path} responded {statusCode} in {elapsed} ms - Request : {requestMessage}, Response : {responseMessage}");
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("VitalSignUpdate")]
        public async Task<IActionResult> VitalSignUpdate(VitalSign vitalSigns)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            var requestMessage = "VitalSigns: " + vitalSigns;
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                //VitalSignsUpdate
                bool result = await _summarySheetManager.VSUpdate(vitalSigns);

                if (result == true)
                {
                    var statusCode = HttpContext.Response.StatusCode;
                    var responseMessage = JsonConvert.SerializeObject(result);
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information($"HTTP {method} {path} responded {statusCode} in {elapsed} ms - Request : {requestMessage}, Response : {responseMessage}");

                    return Ok(new { Success = true });
                }
                else
                {
                    var statusCode = HttpContext.Response.StatusCode;
                    var responseMessage = JsonConvert.SerializeObject(result);
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information($"HTTP {method} {path} responded {statusCode} in {elapsed} ms - Request : {requestMessage}, Response : {responseMessage}");
                    return BadRequest(new { Success = false });
                }
            }
            catch (Exception ex)
            {
                var statusCode = HttpContext.Response.StatusCode;
                var responseMessage = JsonConvert.SerializeObject(ex.Message);
                var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                logger.Information($"HTTP {method} {path} responded {statusCode} in {elapsed} ms - Request : {requestMessage}, Response : {responseMessage}");
                return BadRequest(ex.Message);
            }
        }



        [HttpGet("GetMedicationsList")]
        public async Task<IActionResult> GetMedicationsList(long MRNo)
        {
            try
            {
                var medications = await _summarySheetManager.SS_GetMedicationsList(MRNo);
                return Ok(new { data = medications });
 
            }
            catch(Exception ex) 
            { 
                return BadRequest(ex.Message);
                  
            }



        }

        [HttpGet("GetAllergiesList")]
        public async Task<IActionResult> GetAllergiesList(long MRNo)
        {
            try
            {
                var Allergies = await _summarySheetManager.SS_GetPatientAllergies(MRNo);
                return Ok(new { data = Allergies });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }



        }


        [HttpGet("GetMedicalHistoryList")]
        public async Task<IActionResult> GetMedicalHistoryList(long MRNo, int? PageNumber, int? PageSize)
        {
            try
            {
                var HistoryList = await _summarySheetManager.SS_GetMedicalHistory(MRNo,PageNumber,PageSize);
                return Ok(new { data = HistoryList });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }



        }
        [HttpGet("GetPatientProblemList")]
        public async Task<IActionResult> GetPatientProblemList(long MRNo, int? PageNumber, int? PageSize)
        {
            try
            {
                var Problem = await _summarySheetManager.SS_GetPatientProblem(MRNo, PageNumber, PageSize);
                return Ok(new { data = Problem });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }



        }
        [HttpGet("GetPatientProcedureList")]
        public async Task<IActionResult> GetPatientProcedureList(int? status, long MRNo, int? PageNumber, int? PageSize)
        {
            try
            {
                var Procedure = await _summarySheetManager.SS_GetPatientProcedure(status,MRNo, PageNumber, PageSize);
                return Ok(new { data = Procedure });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }



        }

        [HttpGet("GetPatientImmunizationList")]
        public async Task<IActionResult> GetPatientImmunizationList(long MRNo)
        {
            try
            {
                var Immunization = await _summarySheetManager.SS_GetPatientImmunization(MRNo);
                return Ok(new { data = Immunization });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }



        }
        

        #endregion

        #endregion
    }
}
