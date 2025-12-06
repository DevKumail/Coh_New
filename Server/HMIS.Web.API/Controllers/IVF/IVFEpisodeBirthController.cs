using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Application.DTOs.SpLocalModel;
using HMIS.Application.ServiceLogics.IVF.Episodes.Birth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMIS.Web.Controllers.IVF
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IVFEpisodeBirthController : BaseApiController
    {
        private readonly IIVFEpisodeBirthService _service;

        public IVFEpisodeBirthController(IIVFEpisodeBirthService service)
        {
            _service = service;
        }

        [HttpPost("CreateUpdateEpisodeBirth")]
        public async Task<IActionResult> CreateUpdateEpisodeBirth([FromBody] IVFEpisodeBirthDto dto)
        {
            var result = await _service.CreateOrUpdateEpisodeBirthAsync(dto);
            if (!result.IsSuccess)
                return BadRequest(new { message = result.ErrorMessage });

            return Ok(new { id = result.Data });
        }

        [HttpGet("GetEpisodeBirthByCycleId")]
        public async Task<IActionResult> GetEpisodeBirthByCycleId([FromQuery] int ivfDashboardTreatmentCycleId)
        {
            if (ivfDashboardTreatmentCycleId <= 0)
                return BadRequest(new { message = "ivfDashboardTreatmentCycleId is required" });

            var (ok, data) = await _service.GetEpisodeBirthByCycleId(ivfDashboardTreatmentCycleId);
            if (!ok || data == null)
                return BadRequest(new { message = "Unable to fetch birth information" });

            return Ok(new { birth = data });
        }

        [HttpGet("GetAllEpisodeBirth")]
        public async Task<IActionResult> GetAllEpisodeBirth([FromQuery] int ivfDashboardTreatmentCycleId, [FromQuery] int? page = 1, [FromQuery] int? rowsPerPage = 10)
        {
            if (ivfDashboardTreatmentCycleId <= 0)
                return BadRequest(new { message = "ivfDashboardTreatmentCycleId is required" });

            var pagination = new PaginationInfo { Page = page ?? 1, RowsPerPage = rowsPerPage ?? 10 };
            var (ok, data, total) = await _service.GetAllEpisodeBirthByCycleId(ivfDashboardTreatmentCycleId, pagination);
            if (!ok)
                return BadRequest(new { message = "Unable to fetch birth list" });

            return Ok(new { data, totalRecords = total });
        }

        [HttpDelete("DeleteEpisodeBirth/{id}")]
        public async Task<IActionResult> DeleteEpisodeBirth([FromRoute] long id)
        {
            var (success, message) = await _service.DeleteEpisodeBirthAsync(id);
            if (success)
                return Ok(new { message });

            return BadRequest(new { message });
        }
    }
}
