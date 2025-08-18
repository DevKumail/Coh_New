using HMIS.Core.Entities;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HMIS.Web.Controllers.Clinical
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientProcedureController : BaseApiController
    {

        private readonly IPatientProcedure patientProcedure;


        public PatientProcedureController(IPatientProcedure patientProcedure)
        {
            this.patientProcedure = patientProcedure;

        }
    

        [HttpGet("GetPatientProcedure")]
        public async Task<ActionResult> GetPatientProcedure(string MRNo)
        {
            var patient = await patientProcedure.GetAllPatientProcedure(MRNo);
            return Ok(new { patient = patient });
        }

        [HttpPost("InsertOrUpdatePatientProcedure")]
        public async Task<ActionResult> InsertOrUpdatePatientProcedure(PatientProcedureModel pat)
        {
            try
            {
                bool success = await patientProcedure.InsertOrUpdatePatientProcedure(pat);

                if (success)
                {
                    return Ok(new { message = "Patient Procedure created or updated successfully." });
                }
                else
                {
                    return BadRequest(new { message = "Failed to create or update Patient Procedure." });
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing the request.", error = ex.Message });
            }
        }


        [HttpDelete("DeletePatientProcedure")]
        public async Task<ActionResult> DeletePatientProcedure(long Id)
        {
            var patient = await patientProcedure.DeletePatientProcedure(Id);
            return Ok(new { message = "Patient Procedure Deleted Successfully" });

            //  return Ok(new { patient = patient });
        }


        [HttpGet("GetProcedureList")]

        public async Task<ActionResult> GetProcedureList(long Id, string ProcedureStartCode, string ProcedureEndCode, string DescriptionFilter)
        {
            var patient = await patientProcedure.GetProcedureList(Id, ProcedureStartCode, ProcedureEndCode, DescriptionFilter);
            return Ok(new { procedures = patient });
            //  return Ok(new { patient = patient });
        }

        [HttpGet("GetChargeCaptureProcedureList")]

        public async Task<ActionResult> GetChargeCaptureProcedureList(long Id, string ProcedureStartCode, string ProcedureEndCode, string DescriptionFilter, long ProcedureTypeId)
        {
            var patient = await patientProcedure.GetChargeCaptureProcedureList(Id, ProcedureStartCode, ProcedureEndCode, DescriptionFilter,ProcedureTypeId);
            return Ok(new { procedures = patient });
            //  return Ok(new { patient = patient });
        }
    }
}
