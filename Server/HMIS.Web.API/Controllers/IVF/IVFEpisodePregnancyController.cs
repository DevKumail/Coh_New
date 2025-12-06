using System.Threading.Tasks;
using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Application.DTOs.SpLocalModel;
using HMIS.Application.ServiceLogics.IVF.Episodes.Pregnancy;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMIS.Web.Controllers.IVF
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IVFEpisodePregnancyController : BaseApiController
    {
        private readonly IIVFEpisodePregnancyService _service;

        public IVFEpisodePregnancyController(IIVFEpisodePregnancyService service)
        {
            _service = service;
        }

        [HttpPost("CreateUpdateEpisodePregnancy")]
        public async Task<IActionResult> CreateUpdateEpisodePregnancy([FromBody] IVFEpisodePregnancyDto dto)
        {
            var result = await _service.CreateOrUpdateEpisodePregnancyAsync(dto);
            if (!result.IsSuccess)
                return BadRequest(new { message = result.ErrorMessage });

            return Ok(new { id = result.Data });
        }

        [HttpGet("GetEpisodePregnancyByCycleId")]
        public async Task<IActionResult> GetEpisodePregnancyByCycleId([FromQuery] int ivfDashboardTreatmentCycleId)
        {
            if (ivfDashboardTreatmentCycleId <= 0)
                return BadRequest(new { message = "ivfDashboardTreatmentCycleId is required" });

            var (ok, data) = await _service.GetEpisodePregnancyByCycleId(ivfDashboardTreatmentCycleId);
            if (!ok || data == null)
                return BadRequest(new { message = "Unable to fetch pregnancy" });

            return Ok(new { pregnancy = data });
        }

        [HttpGet("GetAllEpisodePregnancy")]
        public async Task<IActionResult> GetAllEpisodePregnancy([FromQuery] int ivfDashboardTreatmentCycleId, [FromQuery] int? page = 1, [FromQuery] int? rowsPerPage = 10)
        {
            if (ivfDashboardTreatmentCycleId <= 0)
                return BadRequest(new { message = "ivfDashboardTreatmentCycleId is required" });

            var pagination = new PaginationInfo { Page = page ?? 1, RowsPerPage = rowsPerPage ?? 10 };
            var (ok, data, total) = await _service.GetAllEpisodePregnancyByCycleId(ivfDashboardTreatmentCycleId, pagination);
            if (!ok)
                return BadRequest(new { message = "Unable to fetch pregnancies" });

            return Ok(new { data, totalRecords = total });
        }

        [HttpDelete("DeleteEpisodePregnancy/{pregnancyId}")]
        public async Task<IActionResult> DeleteEpisodePregnancy([FromRoute] long pregnancyId)
        {
            var (success, message) = await _service.DeleteEpisodePregnancyAsync(pregnancyId);
            if (success)
                return Ok(new { message });

            return BadRequest(new { message });
        }
    }
}
