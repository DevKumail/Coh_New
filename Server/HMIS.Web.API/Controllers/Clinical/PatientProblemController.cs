using HMIS.Core.Entities;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.DTOs.Demographics;
using HMIS.Application.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HMIS.Web.Controllers.Clinical
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientProblemController : BaseApiController
    {
        #region Fields

        private readonly IPatientProblem patientProblem;

        //// TimerElapsed timerElapsed = new TimerElapsed();
        //#endregion

        //#region Ctor
        public PatientProblemController(IPatientProblem PatientProblem)
        {
          this.patientProblem = PatientProblem;

        }

        #endregion

        [HttpGet("GetPatientProblems")]
        public async Task<ActionResult> GetPatientProblems(string MRNo, long UserId, int? PageNumber, int? PageSize)
        {
            var patientProblems = await patientProblem.GetAllPatientProblems(MRNo , UserId, PageNumber, PageSize);
            return Ok(new { patientProblems = patientProblems });
        }

        [HttpPost("SubmitPatientProblem")]
        public async Task<ActionResult> SubmitPatientProblem(PatientProblemModel patientData)
        {
            try
            {
                bool success = await patientProblem.InsertOrUpdatePatientProblem(patientData);

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
                return StatusCode(500, new { message = "An error occurred while processing the request.", error = ex.Message });
            }

            return Ok(new { patientProblems = "test" });
        }

        [HttpDelete("DeletePatientProblem")]
        public async Task<ActionResult> DeletePatientProblem(long Id)
        {
            var patient = await patientProblem.DeletePatientProblem(Id);
            return Ok(new { message = "Patient Problem Deleted successfully." });

            //  return Ok(new { patient = patient });
        }




    }

    // PUT: api/PatientProblem/5
    //[HttpPut("{id}")]
    //public async Task<IActionResult> PutPatientProblem(long id, PatientProblem patientProblem)
    //{
    //    if (id != patientProblem.Id)
    //    {
    //        return BadRequest();
    //    }

    //    await PatientProblem.UpdatePatientProblem(patientProblem);
    //    return NoContent();
    //}
}

