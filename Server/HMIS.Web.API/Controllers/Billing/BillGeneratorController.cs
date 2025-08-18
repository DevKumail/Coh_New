using HMIS.Core.Entities;
using HMIS.Application.DTOs.BillGeneratorDTOs;
using HMIS.Application.Implementations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using NuGet.Protocol;
using System.Data;
using Task = System.Threading.Tasks.Task;

namespace HMIS.Web.Controllers.Billing
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BillGeneratorController : BaseApiController
    {
        #region Fields

        private readonly IBillGeneratorManager _billGeneratorManager;

        TimerElapsed timerElapsed = new TimerElapsed();
        #endregion

        #region Ctor
        public BillGeneratorController(IBillGeneratorManager billGeneratorManager)
        {
            _billGeneratorManager = billGeneratorManager;
        }
        #endregion
        #region Methods

        #region Get Main Grid Data
        [HttpGet("GetMainGridData")]
        public async Task<IActionResult> GetMainGridData(long VisitAccountNo = 0)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();

            var requestMessage = "VisitAccountNo:" + ((VisitAccountNo != 0 ? VisitAccountNo : 0));
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                VisitAccountNo = (VisitAccountNo == 0) ? 0 : VisitAccountNo;
                DataSet diagnosis = await _billGeneratorManager.GetDiagnosis(VisitAccountNo);
                DataSet diagnosisDel = await _billGeneratorManager.GetDiagnosisDelete(VisitAccountNo);
                DataSet procedures = await _billGeneratorManager.GetProcedures(VisitAccountNo);
                var chgCapComments = _billGeneratorManager.GetChargeCaptureComments(VisitAccountNo);
                elapsed = timerElapsed.StopTimer();
                if (diagnosis != null)
                {
                    var statusCode = HttpContext.Response.StatusCode;
                    var responseMessage = JsonConvert.SerializeObject(new
                    {
                        Diagnosis = diagnosis.Tables[0],
                        DiagnosisDel = diagnosisDel.Tables[0],
                        Procedures=procedures.Tables[0],
                        Comments=chgCapComments
                    });
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information($"HTTP {method} {path} responded {statusCode} in {elapsed} ms - Request : {requestMessage}, Response : {responseMessage}");
                    return Ok(new
                    {
                        Diagnosis = diagnosis.Tables[0],
                        DiagnosisDel = diagnosisDel.Tables[0],
                        Procedures=procedures.Tables[0],
                        Comments = chgCapComments
                    });
                }
                else
                {
                    var statusCode = HttpContext.Response.StatusCode;
                    var responseMessage = JsonConvert.SerializeObject(new
                    {
                        Diagnosis = diagnosis.Tables[0],
                        DiagnosisDel = diagnosisDel.Tables[0],
                        Procedures=procedures.Tables[0],
                        Comments = chgCapComments
                    });
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information($"HTTP {method} {path} responded {statusCode} in {elapsed} ms - Request : {requestMessage}, Response : {responseMessage}");
                    return BadRequest(new
                    {
                        Diagnosis = diagnosis.Tables[0],
                        DiagnosisDel = diagnosisDel.Tables[0],
                        Procedures = procedures.Tables[0],
                        Comments = chgCapComments
                    });
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
        #endregion

        #region Get Diagnosis
        [HttpGet("GetDiagnosis")]
        public async Task<IActionResult> GetDiagnosis(long VisitAccountNo = 0)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();

            var requestMessage = "VisitAccountNo:" + ((VisitAccountNo != 0 ? VisitAccountNo : 0));
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                VisitAccountNo = (VisitAccountNo == 0) ? 0 : VisitAccountNo;

                DataSet diagnosis = await _billGeneratorManager.GetDiagnosis(VisitAccountNo);
                elapsed = timerElapsed.StopTimer();
                if (diagnosis != null)
                {
                    var statusCode = HttpContext.Response.StatusCode;
                    var responseMessage = JsonConvert.SerializeObject(diagnosis);
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information($"HTTP {method} {path} responded {statusCode} in {elapsed} ms - Request : {requestMessage}, Response : {responseMessage}");
                    return Ok(new { Diagnosis = diagnosis.Tables[0] });
                }
                else
                {
                    var statusCode = HttpContext.Response.StatusCode;
                    var responseMessage = JsonConvert.SerializeObject(diagnosis);
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information($"HTTP {method} {path} responded {statusCode} in {elapsed} ms - Request : {requestMessage}, Response : {responseMessage}");
                    return BadRequest(new { Diagnosis = diagnosis.Tables[0] });
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
        #endregion

        #region Get Diagnosis Delete
        [HttpGet("GetDiagnosisDelete")]
        public async Task<IActionResult> GetDiagnosisDelete(long VisitAccountNo = 0)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();

            var requestMessage = "VisitAccountNo:" + ((VisitAccountNo != 0 ? VisitAccountNo : 0));
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                VisitAccountNo = (VisitAccountNo == 0) ? 0 : VisitAccountNo;
                DataSet diagnosis = await _billGeneratorManager.GetDiagnosisDelete(VisitAccountNo);

                elapsed = timerElapsed.StopTimer();
                if (diagnosis != null)
                {

                    var statusCode = HttpContext.Response.StatusCode;
                    var responseMessage = JsonConvert.SerializeObject(diagnosis);
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information($"HTTP {method} {path} responded {statusCode} in {elapsed} ms - Request : {requestMessage}, Response : {responseMessage}");
                    return Ok(new { DiagnosisDel = diagnosis.Tables[0] });
                }
                else
                {
                    var statusCode = HttpContext.Response.StatusCode;
                    var responseMessage = JsonConvert.SerializeObject(diagnosis);
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information($"HTTP {method} {path} responded {statusCode} in {elapsed} ms - Request : {requestMessage}, Response : {responseMessage}");
                    return BadRequest(new { DiagnosisDel = diagnosis.Tables[0] });
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
        #endregion

        #region Delete Diagnosis
        [HttpDelete("DeleteDiagnosis")]
        public async Task<IActionResult> DeleteDiagnosis(long DiagnosisId = 0, long VisitAccountNo = 0, string IcdCode = null, string loginUser = null)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            var requestMessage = $"Diagnosis Id: {DiagnosisId}\nVisitAccountNo: {VisitAccountNo}\nICD Code: {IcdCode}\nLogin User: {loginUser}";
            var errorMessage = "";
            errorMessage += (DiagnosisId == 0) ? "Diagnosis Id not provided" : "";
            errorMessage += (VisitAccountNo == 0) ? (errorMessage.Length > 0) ? "\nVisit Account not provided" : "Visit Account not provided" : "";
            errorMessage += (IcdCode == null) ? (errorMessage.Length > 0) ? "\nICD Code not provided" : "ICD Code not provided" : "";
            errorMessage += (loginUser == null) ? (errorMessage.Length > 0) ? "\nUser not provided" : "User not provided" : "";
            if (errorMessage.Length > 0)
            {
                return BadRequest(errorMessage);
            }
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                var diagnosis = await _billGeneratorManager.DeleteDiagnosis(DiagnosisId, VisitAccountNo, IcdCode, loginUser);
                elapsed = timerElapsed.StopTimer();
                if (diagnosis != null)
                {
                    var statusCode = HttpContext.Response.StatusCode;
                    var responseMessage = JsonConvert.SerializeObject(diagnosis);
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information($"HTTP {method} {path} responded {statusCode} in {elapsed} ms - Request : {requestMessage}, Response : {responseMessage}");
                    return Ok(new { Diagnosis = "Successfully deleted!" });
                }
                else
                {
                    var statusCode = HttpContext.Response.StatusCode;
                    var responseMessage = JsonConvert.SerializeObject(diagnosis);
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information($"HTTP {method} {path} responded {statusCode} in {elapsed} ms - Request : {requestMessage}, Response : {responseMessage}");
                    return BadRequest(diagnosis);
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
        #endregion

        #endregion
    }
}
