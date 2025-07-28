using HMIS.Data.Models;
using HMIS.Service.DTOs.PermissionDTOs;
using HMIS.Service.Implementations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace HMIS.API.Controllers.Common
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AllDropdownsController : BaseApiController
    {
        #region Fields
        private readonly IAllDropdownsManager _allDropdownsManager;
        private readonly IConfiguration _configuration;
        TimerElapsed timerElapsed = new TimerElapsed();
        #endregion

        #region Ctor
        public AllDropdownsController(
            IConfiguration configuration,
            IAllDropdownsManager allDropdownsServices)
        {
            _configuration = configuration;
            _allDropdownsManager = allDropdownsServices;
        }
        #endregion

        #region Methods

        #region GetStateByCountry
        [HttpGet("GetStateByCountry")]
        public async Task<IActionResult> GetStateByCountry(long? countryId)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = "countryId:" + countryId;
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                var result = await _allDropdownsManager.GetStateByCountry(countryId);
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
                var responseMessage = ex.Message;
                var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                logger.Information("HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed} ms - Request: {RequestMessage}, Response: {ResponseMessage}",
    method, path, statusCode, elapsed, requestMessage, responseMessage);
                return BadRequest(ex.Message);
            }

        }
        #endregion

        #region GetCityByState
        [HttpGet("GetCityByState")]
        public async Task<IActionResult> GetCityByState(long? ProviderId)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();
            var requestMessage = "ProviderId:" + ProviderId;
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                var result = await _allDropdownsManager.GetCityByState(ProviderId);
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

        #region GetFeeSchedule
        [HttpGet("GetFeeSchedule")]
        public async Task<IActionResult> GetFeeSchedule()
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();
            var requestMessage = "No parameter";
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                var result = await _allDropdownsManager.GetFeeSchedule();

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
                var responseMessage = JsonConvert.SerializeObject(ex);
                var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                logger.Information("HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed} ms - Request: {RequestMessage}, Response: {ResponseMessage}",
    method, path, statusCode, elapsed, requestMessage, responseMessage);
                return BadRequest(ex.Message);
            }
        }
        #endregion

        #region GetFinancialClass
        [HttpGet("GetFinancialClass")]
        public async Task<IActionResult> GetFinancialClass()
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();
            var requestMessage = "No parameter";
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                var result = await _allDropdownsManager.GetFinancialClass();
                var statusCode = HttpContext.Response.StatusCode;
                var responseMessage = JsonConvert.SerializeObject(result);
                if (result != null)
                {

                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information("HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed} ms - Request: {RequestMessage}, Response: {ResponseMessage}",
        method, path, statusCode, elapsed, requestMessage, responseMessage);
                    return Ok(result);
                }
                else
                {
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

        #region GetEntityTypes
        [HttpGet("GetEntityTypes")]
        public async Task<IActionResult> GetEntityTypes()
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();
            var requestMessage = "No parameter";
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                var result = await _allDropdownsManager.GetEntityTypes();
                var statusCode = HttpContext.Response.StatusCode;
                var responseMessage = JsonConvert.SerializeObject(result);
                if (result != null)
                {
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information("HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed} ms - Request: {RequestMessage}, Response: {ResponseMessage}",
        method, path, statusCode, elapsed, requestMessage, responseMessage);
                    return Ok(result);
                }
                else
                {
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

        #region GetEmirateType
        [HttpGet("GetEmirateType")]
        public async Task<IActionResult> GetEmirateType()
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();
            var requestMessage = "No parameter";
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                var result = await _allDropdownsManager.GetEmirateType();
                var statusCode = HttpContext.Response.StatusCode;
                var responseMessage = JsonConvert.SerializeObject(result);
                if (result != null)
                {
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information("HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed} ms - Request: {RequestMessage}, Response: {ResponseMessage}",
        method, path, statusCode, elapsed, requestMessage, responseMessage);
                    return Ok(result);
                }
                else
                {
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

        #region GetCPTGroup
        [HttpGet("GetCPTGroup")]
        public async Task<IActionResult> GetCPTGroup()
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();
            var requestMessage = "No parameter";
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                var result = await _allDropdownsManager.GetCPTGroupId();
                var statusCode = HttpContext.Response.StatusCode;
                var responseMessage = JsonConvert.SerializeObject(result);
                if (result != null)
                {
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information("HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed} ms - Request: {RequestMessage}, Response: {ResponseMessage}",
        method, path, statusCode, elapsed, requestMessage, responseMessage);
                    return Ok(result);
                }
                else
                {
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

        #region Getsitebyfacility
        [HttpGet("Getsitebyfacility")]
        public async Task<IActionResult> Getsitebyfacility(long? facilityId)
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();
            var requestMessage = "facilityId:" + facilityId;
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                var result = await _allDropdownsManager.GetSitebyfacility(facilityId);
                var statusCode = HttpContext.Response.StatusCode;
                var responseMessage = JsonConvert.SerializeObject(result);
                if (result != null)
                {
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information("HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed} ms - Request: {RequestMessage}, Response: {ResponseMessage}",
        method, path, statusCode, elapsed, requestMessage, responseMessage);
                    return Ok(result);
                }
                else
                {
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

        #region GetEClaimEncounter
        [HttpGet("GetEClaimEncounter")]
        public async Task<IActionResult> GetEClaimEncounters()
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();
            var requestMessage = "No Parameter";
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                var encounterType = await _allDropdownsManager.GetBlEclaimEncounterType();
                var encounterStartType = await _allDropdownsManager.GetBlEclaimEncounterStartType();
                var encounterEndType = await _allDropdownsManager.GetBlEclaimEncounterEndType();
                var statusCode = HttpContext.Response.StatusCode;
                var responseMessage = JsonConvert.SerializeObject(new
                {
                    EncounterType = encounterType,
                    EncounterStartType = encounterStartType,
                    EncounterEndType = encounterEndType
                });
                if (encounterType != null && encounterStartType != null && encounterEndType != null)
                {
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information("HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed} ms - Request: {RequestMessage}, Response: {ResponseMessage}",
        method, path, statusCode, elapsed, requestMessage, responseMessage);
                    return Ok(new
                    {
                        EncounterType = encounterType,
                        EncounterStartType = encounterStartType,
                        EncounterEndType = encounterEndType
                    });
                }
                else
                {
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information("HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed} ms - Request: {RequestMessage}, Response: {ResponseMessage}",
        method, path, statusCode, elapsed, requestMessage, responseMessage);
                    return BadRequest(new
                    {
                        EncounterType = encounterType,
                        EncounterStartType = encounterStartType,
                        EncounterEndType = encounterEndType
                    });
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

        #region GetGenderIdentity
        [HttpGet("GetGenderIdentity")]

        public async Task<IActionResult> GetGenderIdentitys()
        {
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();
            var requestMessage = "No Parameter";
            double elapsed = 0;
            timerElapsed.StartTimer();
            try
            {
                var GetIdentityType = await _allDropdownsManager.GetRegGenderIdentities();
                var statusCode = HttpContext.Response.StatusCode;
                var responseMessage = JsonConvert.SerializeObject(new
                {
                    GetIdentityType = GetIdentityType
                });
                if (GetIdentityType != null)
                {
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information("HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed} ms - Request: {RequestMessage}, Response: {ResponseMessage}",
        method, path, statusCode, elapsed, requestMessage, responseMessage);
                    return Ok(new
                    {
                        GetIdentityType = GetIdentityType,

                    });
                }
                else
                {
                    var logger = LoggerConfig.CreateLogger(requestMessage, responseMessage, configuration);
                    logger.Information("HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed} ms - Request: {RequestMessage}, Response: {ResponseMessage}",
        method, path, statusCode, elapsed, requestMessage, responseMessage);
                    return BadRequest(new
                    {
                        GetIdentityType = GetIdentityType,

                    });
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
        [HttpGet("GetImmunizationList")]

        public IActionResult GetImmunizationLists()
        {

            try
            {
                var getList = _allDropdownsManager.GetImmunizationLists();
                return Ok(getList);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        [HttpGet("GetEMRSite")]

        public IActionResult GetEMRSite()
        {

            try
            {
                var getList = _allDropdownsManager.GetEMRSite();
                return Ok(getList);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        [HttpGet("GetEMRRoute")]

        public IActionResult GetEMRRoute()
        {

            try
            {
                var getList = _allDropdownsManager.GetEMRRoute();
                return Ok(getList);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("GetAlergyTypes")]

        public IActionResult GetAlergyTypes()
        {

            try
            {
                var getList = _allDropdownsManager.GetAlergyTypes();
                return Ok(getList);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("GetSeverityType")]

        public IActionResult GetSeverityType()
        {

            try
            {
                var getList = _allDropdownsManager.GetSeverityType();
                return Ok(getList);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("GetSocialHistory")]

        public IActionResult GetSocialHistory()
        {

            try
            {
                var getList = _allDropdownsManager.GetSocialHistory();
                return Ok(getList);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("GetFamilyProblemHistory")]

        public IActionResult GetFamilyProblemHistory()
        {

            try
            {
                var getList = _allDropdownsManager.GetFamilyProblemHistory();
                return Ok(getList);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("GetComments")]

        public IActionResult GetComments()
        {

            try
            {
                var getList = _allDropdownsManager.GetComments();
                return Ok(getList);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        [HttpGet("GetPatientProcedureTypeList")]

        public IActionResult GetPatientProcedure_TypeList()
        {
            try
            {
                var getList = _allDropdownsManager.GetPatientProcedureTypeList();
                return Ok(getList);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }



        [HttpGet("GetFrequency")]

        public IActionResult GetFrequency()
        {

            try
            {
                var getList = _allDropdownsManager.GetFrequency();
                return Ok(getList);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("GetAlertType")]

        public IActionResult GetAlertType()
        {

            try
            {

                var getList = _allDropdownsManager.GetAlertType();
                return Ok(getList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            #endregion
        }
    }
}
