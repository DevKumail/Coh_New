using DocumentFormat.OpenXml.Wordprocessing;
using HMIS.Application.DTOs.ChargeCaptureDTOs;
using HMIS.Application.Implementations;
using HMIS.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Text.RegularExpressions;

namespace HMIS.Web.Controllers.Billing
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChargeCaptureController : BaseApiController
    {
        #region Fields
        private readonly IConfiguration _configuration;
        private readonly IChargeCaptureManager _chargeCaptureManager;
        TimerElapsed timerElapsed = new TimerElapsed();
        #endregion

        #region Ctor
        public ChargeCaptureController(
           IConfiguration configuration,
           IChargeCaptureManager chargeCaptureManager)
        {
            _configuration = configuration;
            _chargeCaptureManager = chargeCaptureManager;
        }
        #endregion

        #region Methods

        #region Get_UserCPT_Code
        [HttpGet("MyCptCode")]
        public async Task<IActionResult> CC_MyCptCodeGetDB(long ProviderId, long? GroupId, long? PayerId, int? PageNumber, int? PageSize)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();
            var requestMessage = "ProviderId:" + ProviderId + "\nGroupId:" + (GroupId == null ? 0 : GroupId) + "\nPayerId:" + (PayerId == null ? 0 : PayerId);
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                if (GroupId == 0)
                {
                    GroupId = null;
                }
                if (PayerId is null)
                {
                    PayerId = 0;
                }
                DataSet result = await _chargeCaptureManager.CC_MyCptCodeGetDB(ProviderId, GroupId, PayerId, PageNumber,PageSize);
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

        #region Get_UserDiagnosisCode
        [HttpGet("MyDiagnosisCode")]
        public async Task<IActionResult> CC_MyDiagnosisCode(long ProviderId, long? GroupId, long? ICDVersionId, int? PageNumber, int? PageSize)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();
            var requestMessage = "ProviderId:" + ProviderId + "\nGroupId:" + (GroupId == null ? 0 : GroupId) + "\nICDVersionId:" + (ICDVersionId == null ? 0 : ICDVersionId);
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                if (GroupId == 0)
                {
                    GroupId = null;
                }
                if (ICDVersionId == 0)
                {
                    ICDVersionId = null;
                }

                DataSet result = await _chargeCaptureManager.CC_MyDiagnosisCodeDB(ProviderId, GroupId, ICDVersionId, PageNumber, PageSize);

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

        #region Get_AllDiagnosisCode
        [HttpGet("DiagnosisCode")]
        public async Task<IActionResult> CC_DiagnosisCode(int? ICDVersionId, string? DiagnosisStartCode, string? DiagnosisEndCode, string? DescriptionFilter, int? @PageNumber, int? PageSize)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = "ICDVersionId:" + ICDVersionId + "\nDiagnosisStartCode:" + DiagnosisStartCode + "\nDiagnosisEndCode:" + DiagnosisEndCode + "\nDescriptionFilter:" + DescriptionFilter;
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                DataSet result = await _chargeCaptureManager.CC_DiagnosisCodeDB(ICDVersionId, DiagnosisStartCode, DiagnosisEndCode, DescriptionFilter, PageNumber, PageSize);

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

        #region Get_AllCPTCode
        [HttpGet("CPTCode")]
        public async Task<IActionResult> CC_CPTCode(int? AllCPTCode, string? CPTStartCode, string? CPTEndCode, string? Description, int? pageNumber, int? pageSize)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = "AllCPTCode:" + (AllCPTCode == null ? 0 : AllCPTCode) + "\nCPTStartCode:" + CPTStartCode + "\nCPTEndCode:" + CPTEndCode + "\nDescription:" + Description;
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                DataSet result = await _chargeCaptureManager.CC_CPTCodeDB(AllCPTCode, CPTStartCode, CPTEndCode, Description, pageNumber, pageSize);

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

        #region Get_UserDentalCode
        [HttpGet("MyDentalCode")]
        public async Task<IActionResult> CC_MyDentalCode(long ProviderId, long? GroupId, string? ProviderDescription, string? DentalCode, long? PayerId)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = "ProviderId" + ProviderId + "\nGroupId:" + (GroupId == null ? 0 : GroupId) + "\nProviderDescription:" + ProviderDescription + "\nDentalCode:" + DentalCode + "\nPayerId:" + (PayerId == null ? 0 : PayerId);
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                if (PayerId is null)
                {
                    PayerId = 0;
                }

                DataSet result = await _chargeCaptureManager.CC_MyDentalCodeDB(ProviderId, GroupId, ProviderDescription, DentalCode, PayerId);

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

        #region Get_AllDentalCode
        [HttpGet("DentalCode")]
        public async Task<IActionResult> CC_DentalCode(int? AllDentalCode, string? DentalStartCode, string? DentalEndCode, string? DescriptionFilter)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = "AllDentalCode:" + (AllDentalCode == null ? 0 : AllDentalCode) + "\nDentalStartCode:" + DentalStartCode + "\nDentalEndCode:" + DentalEndCode + "\nDescriptionFilter:" + DescriptionFilter;
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                DataSet result = await _chargeCaptureManager.CC_DentalCodeDB(AllDentalCode, DentalStartCode, DentalEndCode, DescriptionFilter);

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

        #region Get_UserHCPCSCode
        [HttpGet("MyHCPCSCode")]
        public async Task<IActionResult> CC_MyHCPCSCode(long ProviderId, long? GroupId, string HCPCSCode, string? DescriptionFilter, long? PayerId)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = "ProviderId:" + ProviderId + "\nGroupId:" + (GroupId == null ? 0 : GroupId) + "\nHCPCSCode:" + HCPCSCode + "\nDescriptionFilter:" + DescriptionFilter + "\nPayerId:" + (PayerId == null ? 0 : PayerId);
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                DataSet result = await _chargeCaptureManager.CC_MyHCPCSCodeDB(ProviderId, GroupId, HCPCSCode, DescriptionFilter, PayerId);
                if (PayerId is null)
                {
                    PayerId = 0;
                }
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

        #region Get_AllHCPSCode
        [HttpGet("HCPCSCode")]
        public async Task<IActionResult> CC_HCPCSCode(int? AllHCPCSCode, string? HCPCStartCode, string? HCPCSEndCode, string? DescriptionFilter)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = "AllHCPCSCode:" + (AllHCPCSCode == null ? 0 : AllHCPCSCode) + "\nHCPCStartCode:" + HCPCStartCode + "\nHCPCSEndCode:" + HCPCSEndCode + "\nDescriptionFilter:" + DescriptionFilter;
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                DataSet result = await _chargeCaptureManager.CC_HCPCSCodeDB(AllHCPCSCode, HCPCStartCode, HCPCSEndCode, DescriptionFilter);

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

        #region Get_UnclassifiedService
        [HttpGet("UnclassifiedService")]
        public async Task<IActionResult> CC_UnclassifiedService(int? AllCode, string? UCStartCode, string? DescriptionFilter)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = "AllCode:" + (AllCode == null ? 0 : AllCode) + "\nUCStartCode:" + UCStartCode + "\nDescriptionFilter:" + DescriptionFilter;
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                DataSet result = await _chargeCaptureManager.CC_UnclassifiedServiceDB(AllCode, UCStartCode, DescriptionFilter);

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

        #region Get_ServiceItems
        [HttpGet("ServiceItems")]
        public async Task<IActionResult> CC_ServiceItems(int? AllCode, string? ServiceStartCode, string? DescriptionFilter)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = "AllCode:" + (AllCode == null ? 0 : AllCode) + "\nServiceStartCode:" + ServiceStartCode + "\nDescriptionFilter:" + DescriptionFilter;
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                DataSet result = await _chargeCaptureManager.CC_ServiceItemsDB(AllCode, ServiceStartCode, DescriptionFilter);

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

        #region Post_InsertMyDiagnosisCodeGrid
        [HttpPost("InsertMyDiagnosisCodeGrid")]
        public async Task<IActionResult> InsertMyDiagnosisCodeGrid(List<BLSuperBillDiagnosis> Bl)
        {

            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = JsonConvert.SerializeObject(Bl);
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                var result = await _chargeCaptureManager.InsertMyDiagnosisCodeGridDB(Bl);

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

        #region Put_UpdateMyDiagnosisCodeGrid
        [HttpPut("UpdateMyDiagnosisCodeGrid")]
        public async Task<IActionResult> UpdateMyDiagnosis(List<BLSuperBillDiagnosis> Bl)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = JsonConvert.SerializeObject(Bl);
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                var result = await _chargeCaptureManager.UpdateMyDiagnosisDB(Bl);

                elapsed = timerElapsed.StopTimer();
                if (result != null)
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

        #region Post_InsertAllGrid
        [HttpPost("InsertAllGrid")]
        public async Task<IActionResult> InsertAllGrid(List<BLSuperBillProcedure> Bl)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = JsonConvert.SerializeObject(Bl);
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                var result = await _chargeCaptureManager.InsertAllGridDB(Bl);

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

        #region Put_UpdateMyProcedureCodeGrid
        [HttpPut("UpdateMyProcedureCodeGrid")]
        public async Task<IActionResult> UpdateMyProcedure(List<BLSuperBillProcedure> Bl)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = JsonConvert.SerializeObject(Bl);
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                var result = await _chargeCaptureManager.UpdateMyProcedureDB(Bl);

                elapsed = timerElapsed.StopTimer();
                if (result == "OK")
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

        #region Get_GridDataByVisitAccountNo
        [HttpGet("GridDataByVisitAccountNo")]
        public async Task<IActionResult> GridDataByVisitAccountNo(long VisitAccountNo)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = "VisitAccountNo:" + VisitAccountNo;
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                DataSet result = await _chargeCaptureManager.CC_GridDataDB(VisitAccountNo);

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

        #region Get_GetICD9CMGroupByProvider
        [HttpGet("GetICD9CMGroupByProvider")]
        public async Task<IActionResult> GetICD9CMGroupByProvider(long? ProviderId)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = "ProviderId:" + (ProviderId == null ? 0 : ProviderId);
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                var result = await _chargeCaptureManager.GetICD9CMGroupByProvider(ProviderId);

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

        #region Post_SaveChargeCapture
        [HttpPost("SaveChargeCapture")]
        public async Task<IActionResult> SaveChargeCapture(ChargCaptureModel ChargCaptureModel)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = JsonConvert.SerializeObject(ChargCaptureModel);
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                var result = await _chargeCaptureManager.SaveChargeCapture(ChargCaptureModel);

                elapsed = timerElapsed.StopTimer();
                if (result == "OK")
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

        #region Get_GetCPTByProvider
        [HttpGet("GetCPTByProvider")]
        public async Task<IActionResult> GetCPTByProvider(long? ProviderId)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = "ProviderId:" + (ProviderId == null ? 0 : ProviderId);
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                var result = await _chargeCaptureManager.GetCPTByProvider(ProviderId);

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

        #region Get_GetICD9CMGroupByProvider
        [HttpGet("GetHCPCSByProvider")]
        public async Task<IActionResult> GetHCPCSByProvider(long? ProviderId)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = "ProviderId:" + (ProviderId == null ? 0 : ProviderId);
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                var result = await _chargeCaptureManager.CC_LoadAllGroupsAndCodes(0, ProviderId, 0);

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

        #endregion
    }

}
