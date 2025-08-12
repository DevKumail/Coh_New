using HMIS.Core.Entities;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.Implementations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SqlServer.Management.Smo.Agent;

namespace HMIS.API.Controllers.Clinical
{
    [Route("api/[controller]")]
    [ApiController]

    public class PatientChartFamilyHistoryController : Controller
    {
        #region Feilds
        private readonly IPatientChartFamilyHistoryManager FamilyHistory;

        public PatientChartFamilyHistoryController(IPatientChartFamilyHistoryManager familyHistory)
        {
            this.FamilyHistory = familyHistory;
        }
        #endregion


        
        [HttpGet("GetAllSocialHistory")]
        public async Task<ActionResult> GetAllSocialHistory()
        {
            var List = await FamilyHistory.GetAllSocialHistory();
            return Ok(List);
        }
        
        [HttpPost("CreateSocialHistory")]
        public async Task<ActionResult> CreateSocialHistory(PatientChartFamilyHistoryModel model)
        {
            //Task<string> CreateSocialHistory(PatientChartFamilyHistoryModel model)
            var Result = await FamilyHistory.CreateSocialHistory(model);
            if(Result== "Save Successfully")
            {
                return Ok(new { Result = Result });
            }
            else
            {
                return BadRequest(new { message = "Failed to create Social History." });
            }
            return Ok(new {Error="Error"});
        }

        [HttpDelete("DeleteSocialHistoryByShId/{shid}")]
        public async Task<ActionResult> DeleteSocialHistoryByShId(long shid)
        {
            var List = await FamilyHistory.DeleteSocialHistoryByShId(shid);
            return Ok(List);
        }


        [HttpGet("GetAllFamilyHistory")]
        public async Task<ActionResult> GetAllFamilyHistory()
        {
            var List = await FamilyHistory.GetAllFamilyHistory();
            return Ok(List);
        }

        [HttpPost("CreateFamilyHistory")]
        public async Task<ActionResult> CreateFamilyHistory(PatientChartFamilyHistoryModel model)
        {
            //Task<string> CreateSocialHistory(PatientChartFamilyHistoryModel model)
            var Result = await FamilyHistory.CreateFamilyHistory(model);
            if (Result == "Save Successfully")
            {
                return Ok(new { Result = Result });
            }
            else
            {
                return BadRequest(new { message = "Failed to create Family History." });
            }
            return Ok(new { Error = "Error" });
        }

        [HttpDelete("DeleteFamilyHistoryByFHID/{fhid}")]
        public async Task<ActionResult> DeleteFamilyHistoryByFHID(long fhid)
        {
            var List = await FamilyHistory.DeleteFamilyHistoryByFHID(fhid);
            return Ok(List);
        }

    }
}
