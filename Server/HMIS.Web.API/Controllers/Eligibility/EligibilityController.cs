using HMIS.Core.Entities;
using HMIS.Application.DTOs.AppointmentDTOs;
using HMIS.Application.DTOs.BillGeneratorDTOs;
using HMIS.Application.Implementations;
using HMIS.Application.ServiceLogics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using NuGet.Protocol;
using System.Data;
using System.Linq.Dynamic.Core;
using Task = System.Threading.Tasks.Task;
using Newtonsoft.Json;

namespace HMIS.Web.Controllers.Eligibility
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EligibilityController : BaseApiController
    {
        private readonly HmisContext _context;

        private readonly IEligibilityManager _eligibilityManager;
        private readonly IConfiguration _configuration;
        TimerElapsed timerElapsed = new TimerElapsed();

        public EligibilityController(IEligibilityManager eligibilityManager, IConfiguration configuration, HmisContext context)
        {
            _eligibilityManager = eligibilityManager;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("InsertEligibility")]
        public async Task<IActionResult> InsertEligibilityLogDetails(long mrno)
        {

            var getappid = _context.SchAppointments.Where(x=>x.Mrno == mrno.ToString()).OrderByDescending(x=>x.AppId).FirstOrDefault().AppId;
            var (columnNames, columnValues) = await _eligibilityManager.InsertEligibilityLog(getappid);
            long insertedRowId;
            if (columnNames.Any() && columnValues.Any())
            {
                var jsonData = new List<Dictionary<string, object>>();


                foreach (var row in columnValues)
                {
                    var rowData = new Dictionary<string, object>();

                    for (int i = 0; i < columnNames.Count; i++)
                    {
                        rowData.Add(columnNames[i], row[i]);
                    }
                    EligibilityLog eligibility = new EligibilityLog();
                    eligibility.VisitId = Convert.ToInt64(rowData["VisitId"]);
                    eligibility.PatientId = Convert.ToInt64(rowData["PatientId"]);
                    eligibility.PayerId = Convert.ToInt64(rowData["PayerId"]);
                    eligibility.PlanId = Convert.ToInt64(rowData["PlanId"]);
                    eligibility.FacilityId = Convert.ToInt32(rowData["facilityId"]);
                    eligibility.RequestedbyId = Convert.ToInt64(rowData["RequestedbyId"]);
                    eligibility.Request = "";
                    eligibility.Response = "";
                    eligibility.Status = "Pending";
                    eligibility.Priority = 2;
                    eligibility.EligiblityDate = System.DateTime.Now;
                    eligibility.Mrno = mrno.ToString();
                    _context.EligibilityLogs.Add(eligibility);
                    _context.SaveChanges();
                    insertedRowId = eligibility.Id;
                    jsonData.Add(rowData);
                    Get270Details(getappid, insertedRowId, mrno);
                }
                
                var jsonResult = JsonConvert.SerializeObject(jsonData);

                return Ok(jsonResult);
            }

            return BadRequest("No data found");
        }

        [HttpPost("Get270")]
        public async Task Get270Details(long getappid, long insertedRowId, long mrno)
        {
            var getname = _context.RegPatients.FirstOrDefault(x => x.Mrno == mrno.ToString());
            var (columnNames, columnValues) = await _eligibilityManager.Get270fileInfoByAppId(getappid);
            if (columnNames.Any() && columnValues.Any())
            {
                var jsonData = new List<Dictionary<string, object>>();


                foreach (var row in columnValues)
                {
                    var rowData = new Dictionary<string, object>();

                    for (int i = 0; i < columnNames.Count; i++)
                    {
                        rowData.Add(columnNames[i], row[i]);


                    }
                    
                    string claimLicenseNo = Convert.ToString(rowData["ClaimLicenseNumber"]);
                    string facilityEligInfo = Convert.ToString(rowData["FacilityCodeforEligibilityInformation"]);
                    string payerCode = Convert.ToString(rowData["PayerCodeforEligibilityInformation"]);
                    string insuredNo = Convert.ToString(rowData["InsuredIDNo"]);
                    string ssnNo = Convert.ToString(rowData["InsuredIDNo"]);
                    string birthDate = Convert.ToString(rowData["BirthDate"]);

                    string subscriberName = getname.PersonFirstName;
                    string subsciberName2 = getname.PersonLastName;
                    _eligibilityManager.Gen270File(subscriberName, subsciberName2, claimLicenseNo, facilityEligInfo, payerCode, insuredNo, ssnNo, birthDate, insertedRowId);

                    jsonData.Add(rowData);
                }

               

                var jsonResult = JsonConvert.SerializeObject(jsonData);

                //return Ok(jsonResult);
            }

            //return BadRequest("No data found");
        }


        [HttpGet("getEligibilityLog")]
        public async Task<IActionResult> ViewEligibilityLog(long mrno)
        {
            DataSet result = await _eligibilityManager.GetEligibilityLogDetailsDB(mrno);

            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        //[HttpGet("getEligibilityLog")]
        //public IActionResult GetEligibilityLog()
        //{
        //    try
        //    {
        //        var eligibilityLogs = _context.EligibilityLogs.ToList();
        //        return Ok(eligibilityLogs);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving eligibility logs.");
        //    }
        //}
    }
}
