using System.Threading.Tasks;
using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Application.DTOs.SpLocalModel;
using HMIS.Application.ServiceLogics.IVF.Episodes.Aspiration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMIS.Web.Controllers.IVF
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IVFEpisodeAspirationController : BaseApiController
    {
        private readonly IIVFEpisodeAspirationService _service;

        public IVFEpisodeAspirationController(IIVFEpisodeAspirationService service)
        {
            _service = service;
        }

        [HttpPost("CreateUpdateEpisodeAspiration")]
        public async Task<IActionResult> CreateUpdateEpisodeAspiration([FromBody] IVFEpisodeAspirationDto dto)
        {
            var result = await _service.CreateOrUpdateEpisodeAspirationAsync(dto);
            if (!result.IsSuccess)
                return BadRequest(new { message = result.ErrorMessage });

            return Ok(new { id = result.Data });
        }

        [HttpGet("GetByIdAspirationById")] 
        public async Task<IActionResult> GetByIdAspirationById([FromQuery] long aspirationId)
        {
            if (aspirationId <= 0)
                return BadRequest(new { message = "aspirationId is required" });

            var (ok, data) = await _service.GetEpisodeAspirationById(aspirationId);
            if (!ok || data == null)
                return BadRequest(new { message = "Unable to fetch aspiration" });

            return Ok(new { aspiration = data });
        }

        [HttpGet("GetAllEpisodeAspiration")] 
        public async Task<IActionResult> GetAllEpisodeAspiration([FromQuery] int ivfDashboardTreatmentCycleId, [FromQuery] int? page = 1, [FromQuery] int? rowsPerPage = 10)
        {
            if (ivfDashboardTreatmentCycleId <= 0)
                return BadRequest(new { message = "ivfDashboardTreatmentCycleId is required" });

            var pagination = new PaginationInfo { Page = page ?? 1, RowsPerPage = rowsPerPage ?? 10 };
            var (ok, data, total) = await _service.GetAllEpisodeAspirationByCycleId(ivfDashboardTreatmentCycleId, pagination);
            if (!ok)
                return BadRequest(new { message = "Unable to fetch aspirations" });

            return Ok(new { data, totalRecords = total });
        }

        [HttpDelete("DeleteEpisodeAspiration/{aspirationId}")]
        public async Task<IActionResult> DeleteEpisodeAspiration([FromRoute] long aspirationId)
        {
            var (success, message) = await _service.DeleteEpisodeAspirationAsync(aspirationId);
            if (success)
                return Ok(new { message });

            return BadRequest(new { message });
        }
    }
}
