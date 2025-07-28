using HMIS.Data.Models;
using HMIS.Service.DTOs.Clinical;
using HMIS.Service.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;

namespace HMIS.API.Controllers.Clinical
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlergyController : ControllerBase
    {
        #region Fields
        private readonly IAlergyManager Alergy;

        public AlergyController(IAlergyManager Alergy)
        {
            this.Alergy = Alergy;
        }
        #endregion


        [HttpGet("GetAlergyDetailsDB")]
        public async Task<ActionResult> GetAlergyDetailsDB(string mrno)
        {
            var allergys = await Alergy.GetAlergyDetailsDB(mrno);
            return Ok(new { allergys = allergys });
        }

        [HttpPost("SubmitPatientAlergy")]

        public async Task<ActionResult> SubmitPatientAlergy (AlergyModel patientData)
        {
            try
            {
                bool success = await Alergy.InsertOrUpdateAlergy(patientData);

                if (success) 
                {
                    return Ok(new { message = "Patient information created or updated successfully." });
                }
                else
                {
                    return BadRequest(new { message = "Failed to create or update patient information." });
                }

            }
            catch (Exception ex) 
            {
                return StatusCode(500, new { message = "An error occurred while processing the request.", error = ex.Message});
            }
            return Ok(new { patientAlergy = "test" });
        }

        [HttpDelete("DeleteAlergy")]
        public async Task<ActionResult> DeleteAlergy(long Id)
        {
            var patient = await Alergy.DeleteAlergy(Id);
            return Ok(new { message = "Patient Alergy Deleted successfully." });
        }




    }
}
