using HMIS.Infrastructure.Helpers;
using HMIS.Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Data;
using HMIS.Application.Implementations;
using HMIS.Application.DTOs.CommonDTOs;
using Microsoft.AspNetCore.Authorization;
using HMIS.Application.DTOs.SpLocalModel;
using static HMIS.Application.DTOs.SpLocalModel.DemographicListModel;

namespace HMIS.Web.Controllers.Common
{
    [Route("api/[controller]")]
    [ApiController]
     [Authorize]

    public class CommonController : BaseApiController
    {
        private readonly ICommonManager _commonManager;
        public CommonController(ICommonManager commonManager)
        {
            _commonManager = commonManager;
        }

        [HttpGet("GetPatientFamily")]
        public async Task<IActionResult> GetPatientFamilyByMRNo(string MRNo)
        {


            DataSet result = await _commonManager.GetFamilyByMRNoDB(MRNo);


            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet("GetCoverageAndRegPatientDBByMrNo")]
        public async Task<IActionResult> GetCoverageAndRegPatientDBByMrNo(string MRNo = "")
        {
            //table1 = REG_GetUniquePatientOld
            MRNo = MRNo == "-1" ? string.Empty : MRNo;
            DataSet result = await _commonManager.GetCoverageAndRegPatientDBByMrNo(MRNo);
            if (result != null)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpPost("GetCoverageAndRegPatient")]
        public async Task<IActionResult> GetCoverageAndRegPatient([FromBody] FilterDemographicList req)
            {
            //table1 = REG_GetUniquePatientOld

            //MRNo = MRNo == "-1" ? string.Empty : MRNo;
            DataSet result = await _commonManager.GetCoverageAndRegPatientDB(req);


            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        } 
        [HttpGet("GetRegPatientList")]
        public async Task<IActionResult> GetRegPatientList()
            {
            DataSet result = await _commonManager.GetRegPatientDB();


            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet("GetAppointmentInfoByMRNo")]

        public async Task<IActionResult> GetAppointmentInfoByMRNo(string MRNo = "")
        {
            DataSet result = await _commonManager.GetAppointmentDetailsByMRNo(MRNo);


            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet("GetInsurrancePayerInfo")]
        public async Task<IActionResult> GetInsurrancePayerInfo(long MRNo)
        {
            //table1 = REG_GetUniquePatientOld

            DataSet result = await _commonManager.GetInsurrancePayerInfo(MRNo);


            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }







        [HttpGet]

        [Route("GetEmployeeFacilityFromCache")]
        public IActionResult GetEmployeeFacilityFromCache()
        {
            List<HrEmployeeFacility> filtered = new List<HrEmployeeFacility>();

            Dictionary<string, JArray> cache = CacheHelper.Instance.ReadInMemoryCache(new List<string>() { "hremployeefacility" });
            long userId = Convert.ToInt64(User.Claims.Where(c => c.Type == "UserId").First().Value);
            if (cache.Count > 0)
            {
                //EmployeeId = 


                foreach (KeyValuePair<string, JArray> entry in cache)
                {

                    filtered = entry.Value.ToObject<List<HrEmployeeFacility>>();
                }

                if (filtered.Count > 0)
                {
                    filtered = filtered.Where(a => a.EmployeeId == userId).ToList();

                }

                return Ok(new { cache = JsonConvert.SerializeObject(filtered) });



                //filter cache

            }

            return Ok(new { });
        }



        [HttpGet("GetDemographicByVisitAccountNo")]
        public async Task<IActionResult> GetDemographic(string VisitAccountDisplay)
        {


            DataSet result = await _commonManager.GetDemographicDB(VisitAccountDisplay);


            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

    }
}
