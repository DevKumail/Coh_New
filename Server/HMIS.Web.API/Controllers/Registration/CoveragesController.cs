using HMIS.Application.DTOs.Coverage;
using HMIS.Application.DTOs.SpLocalModel;
using HMIS.Application.Implementations;
using HMIS.Application.ServiceLogics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;

namespace HMIS.Web.Controllers.Registration
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CoveragesController : BaseApiController
    {
        private readonly ICoveragesManager _coverageManager;
        private readonly IConfiguration _configuration;
        TimerElapsed timerElapsed = new TimerElapsed();
        public CoveragesController(ICoveragesManager coverageManager)
        {
            _coverageManager = coverageManager;

        }

        [HttpPost("GetCoveragesList")]
        public async Task<IActionResult> GetCoveragesList([FromBody] CoverageList req)
        {
            DataSet result = await _coverageManager.GetCoveragesList(req);


            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        [HttpGet("GetSearch")]
        public async Task<IActionResult> GetSearch(Byte? CompanyOrIndividual, string? LastName, string? SSN, string? InsuredIDNo, string? MRNo, int PageNumber, int PageSize)
        {

            if (string.IsNullOrEmpty(MRNo))
            {
                MRNo = null;
            }

            //if (DateTime.)
            //{
            //    MRNo = null;
            //}

            DataSet result = await _coverageManager.GetSearchDB(CompanyOrIndividual, LastName, SSN, InsuredIDNo, MRNo, PageNumber, PageSize);

            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        [HttpGet("BLEligibilityLogs")]
        public async Task<IActionResult> GetBLEligibilityLogs(string? MRNo, long? VisitAccountNo, int? EligibilityId, int? ELStatusId, string? MessageRequestDate, string? MessageResponseDate)
        {

            //if (string.IsNullOrEmpty(MRNo))
            //{
            //    MRNo = null;
            //}

            DataSet result = await _coverageManager.GetBLEligibilityLogsDB(MRNo, VisitAccountNo, EligibilityId, ELStatusId, MessageRequestDate, MessageResponseDate);

            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet("GetSubscriberDatails{InsuredIDNo}")]
        public async Task<IActionResult> GetSubcriberDetails(string InsuredIDNo)
        {
            DataSet result = await _coverageManager.GetSubcriberDetailsDB(InsuredIDNo);


            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);

        }

        [HttpGet("GetCoveragesubscribedId")]
        public async Task<IActionResult> GetCoverageDB(long subscribedId)
        {
            DataSet result = await _coverageManager.GetCoverageDB(subscribedId);


            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);

        }

        [HttpPost("InsertSubscriber")]
        public async Task<IActionResult> InsertSubscriber(InsuranceSubscriber regInsert)
        {
         
            var method = HttpContext.Request.Method;
            var path = HttpContext.Request.Path;
            var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();
            var requestMessage = JsonConvert.SerializeObject(regInsert);
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
           // var result = await _coverageManager.InsertSubscriberDB(regInsert);


            //if (result == "OK")
            //{
            //    return Ok(new { Success = true });
            //}

            try
            {
                if (regInsert.SubscriberID > 0)
                {
                    //regInsert.upda = User.Claims.Where(c => c.Type == "UserName").First().Value;
                    var result = await _coverageManager.UpdateSubscriberDB(regInsert);
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
                else
                {
                    //reg.CreatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;
                    var result = await _coverageManager.InsertSubscriberDB(regInsert);
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
           // return BadRequest(result);
        }

        [HttpPost("GetImageData")]
        public async Task<IActionResult> GetImageData([FromForm] InsuranceCardModel insuranceCardModel)
        {
            try
            {
                long PayerId = insuranceCardModel.PayerId;


                var result = await _coverageManager.ReadImage(insuranceCardModel.image, PayerId);

                return Ok(result);

                return BadRequest(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        //[HttpPut("UpdateSubscriber")]
        //public async Task<IActionResult> UpdateSubscriber(InsuranceSubscriber regUpdate)
        //{
        //    // regInsert.EnteredBy = User.Claims.Where(c => c.Type == "UserName").First().Value;

        //    var result = await _coverageManager.UpdateSubscriberDB(regUpdate);

        //    if (result == "OK")
        //    {
        //        return Ok(new { Success = true });
        //    }


        //    return BadRequest(result);



        //}
        [HttpGet("GetInsuranceRelation")]
        public async Task<object> GetInsuranceRelation()
        {
            try
            {
                var result = await _coverageManager.GetInsuranceRelation();
                return Ok(result);
                return BadRequest(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
