using HMIS.Application.Implementations;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace HMIS.API.Controllers.Registration
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize]

    public class EncounterController : BaseApiController
    {
        private readonly IEncounterManager _encounterManager;
        public EncounterController(IEncounterManager encounterManager)
        {
            _encounterManager = encounterManager;
        }

        [HttpGet("GetEncountersByMRNo")]
        public async Task<IActionResult> GetEncounterByMRNo(string MRNo, int? PageNumber, int? PageSize)
        {
            //table1 = REG_GetUniquePatientOld
            DataSet result = await _encounterManager.GetEncounterByMRNoDB(MRNo, PageNumber, PageSize);


            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
    }
}
