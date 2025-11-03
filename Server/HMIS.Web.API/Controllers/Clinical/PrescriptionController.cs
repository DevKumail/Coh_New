using HMIS.Core.Entities;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HMIS.Web.Controllers.Clinical
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptionController : ControllerBase
    {
        private readonly IPrescription prescription;
         
        public PrescriptionController(IPrescription prescription)
        {
            this.prescription = prescription;

        }


        [HttpGet("GetCurrentPrescriptions")]
        public async Task<ActionResult> GetCurrentPrescriptionsList(string mrno, int? PageNumber, int? PageSize)
        {
            var prescriptions = await prescription.GetAllCurrentPrescriptions(mrno, PageNumber, PageSize);
            return Ok(new { prescription = prescriptions });
        }


        [HttpGet("GetPastPrescriptions")]
        public async Task<ActionResult> GetPastPrescriptionsList(string mrno, int? PageNumber, int? PageSize)
        {
            var prescriptions = await prescription.GetAllPastPrescriptions(mrno,PageNumber, PageSize);
            return Ok(new { prescription = prescriptions });
        }


        [HttpPost("InsertOrUpdatePrescriptions")]
        public async Task<ActionResult> InsertOrUpdatePrescriptions(PrescriptionModel pres)
        {
            try
            {
                bool success = await prescription.InsertOrUpdatePrescription(pres);

                if (success)
                {
                    return Ok(new { message = "Prescriptions created or updated successfully." });
                }
                else
                {
                    return BadRequest(new { message = "Failed to create or update Prescription." });
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing the request.", error = ex.Message });
            }
        }


        [HttpDelete("DeletePrescriptions")]
        public async Task<ActionResult> DeletePrescriptions(long Id)
        {
            var patient = await prescription.DeletePrescription(Id);
            return Ok(new { message = "Prescription Deleted Successfully" });

            //  return Ok(new { patient = patient });
        }



        [HttpGet("SearchByPrescriptions")]
        public async Task<ActionResult> SearchByPrescriptions(string? keyword, int? PageNumber, int? PageSize)
        {
            var prescriptions = await prescription.FilterPrescriptions(keyword, PageNumber, PageSize);
            return Ok(new { prescription = prescriptions });

             
        }

        


    }
}
