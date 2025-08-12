using HMIS.Core.Entities;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HMIS.API.Controllers.Clinical
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientImmunizationController : BaseApiController
    {
        private readonly IPatientImmunization patientImmunization;

         
        public PatientImmunizationController(IPatientImmunization patientImmunization)
        {
            this.patientImmunization = patientImmunization;
 
        }

        [HttpGet("GetPatientImmunizationList")]
        public async Task<ActionResult> GetPatientImmunizationList(string mrno)
        {
            var patient  = await patientImmunization.GetAllPatientImmunization(mrno);
            return Ok(new { patient = patient });
        }

        [HttpPost("InsertOrUpdatePatientImmunization")]
        public async Task<ActionResult> InsertOrUpdatePatientImmunization(PatientImmunizationModel pat)
        {
            try
            {
                bool success = await patientImmunization.InsertOrUpdatePatientImmunization(pat);

                if (success)
                {
                    return Ok(new { message = "Patient Immunization created or updated successfully." });
                }
                else
                {
                    return BadRequest(new { message = "Failed to create or update patient Immunization." });
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing the request.", error = ex.Message });
            }
        }

         
        [HttpDelete("DeletePatientImmunization")]
        public async Task<ActionResult> DeletePatientImmunization(long Id)
        {
            var patient = await patientImmunization.DeletePatientImmunization(Id);
            return Ok(new { message = "Patient Immunization Deleted successfully." });

          //  return Ok(new { patient = patient });
        } 
    }
}
