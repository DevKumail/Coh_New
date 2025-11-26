using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Application.ServiceLogics.IVF;
using HMIS.Core.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMIS.Web.Controllers.IVF
{

    [Route("api/[controller]")]
    [ApiController]
    public class IVFMaleSemanAnalysisController : ControllerBase
    {
        private readonly IIVFMaleSemenService _semenService;

        public IVFMaleSemanAnalysisController(IIVFMaleSemenService semenService)
        {
            _semenService = semenService;
        }

        [HttpPost("InsertOrUpdate")]
        public async Task<ActionResult> AddSemenSample([FromBody] IVFMaleSemenSampleDto sampleDto)
        {
            try
            {
                bool success = await _semenService.InsertOrUpdateSemenSample(sampleDto);
                if (success)
                    return Ok(new { message = "Semen sample created or updated successfully." });
                else
                    return BadRequest(new { message = "Failed to create or update semen sample." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred.", error = ex.Message });
            }
        }

        [HttpGet("GetAll")]
        public async Task<ActionResult> GetAll([FromQuery] int ivfMainId,int page = 1, int pageSize = 10)
        {
            try
            {
                var result = await _semenService.GetAllSemenSamples(ivfMainId,page, pageSize);

                return Ok(new
                {
                    data = result.Data,
                    totalCount = result.TotalCount
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred.", error = ex.Message });
            }
        }

        [HttpGet("GetSampleById/{sampleId}")]
        public async Task<ActionResult<IVFMaleSemenSampleDto>> GetSampleById(int sampleId)
        {
            try
            {
                var sample = await _semenService.GetSemenSampleById(sampleId);
                if (sample == null)
                    return NotFound(new { message = "Semen sample not found." });

                return Ok(sample);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred.", error = ex.Message });
            }
        }

        [HttpDelete("DeleteSample/{sampleId}")]
        public async Task<ActionResult> DeleteSample(int sampleId, [FromQuery] int? updatedBy = null)
        {
            try
            {
                bool deleted = await _semenService.DeleteSemenSample(sampleId, updatedBy);
                if (deleted)
                    return Ok(new { message = "Semen sample deleted successfully." });
                else
                    return NotFound(new { message = "Semen sample not found or already deleted." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred.", error = ex.Message });
            }
        }
    }
}