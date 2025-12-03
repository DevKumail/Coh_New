using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Application.DTOs.SpLocalModel;
using HMIS.Application.ServiceLogics.IVF.Episodes.Transfer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMIS.Web.Controllers.IVF
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IVFEpisodeTransferController : BaseApiController
    {
        private readonly IIVFEpisodeTransferService _service;

        public IVFEpisodeTransferController(IIVFEpisodeTransferService service)
        {
            _service = service;
        }

        [HttpPost("CreateUpdateEpisodeTransfer")]
        public async Task<IActionResult> CreateUpdateEpisodeTransfer([FromBody] IVFEpisodeTransferDto dto)
        {
            var result = await _service.CreateOrUpdateEpisodeTransferAsync(dto);
            if (!result.IsSuccess)
                return BadRequest(new { message = result.ErrorMessage });

            return Ok(new { id = result.Data });
        }

        [HttpGet("GetEpisodeTransferById")]
        public async Task<IActionResult> GetEpisodeTransferById([FromQuery] int ivfDashboardTreatmentCycleId)
        {
            if (ivfDashboardTreatmentCycleId <= 0)
                return BadRequest(new { message = "ivfDashboardTreatmentCycleId is required" });

            var (ok, data) = await _service.GetEpisodeTransferById(ivfDashboardTreatmentCycleId);
            if (!ok || data == null)
                return BadRequest(new { message = "Unable to fetch transfer" });

            return Ok(new { transfer = data });
        }

        [HttpGet("GetAllEpisodeTransfer")]
        public async Task<IActionResult> GetAllEpisodeTransfer([FromQuery] int ivfDashboardTreatmentCycleId, [FromQuery] int? page = 1, [FromQuery] int? rowsPerPage = 10)
        {
            if (ivfDashboardTreatmentCycleId <= 0)
                return BadRequest(new { message = "ivfDashboardTreatmentCycleId is required" });

            var pagination = new PaginationInfo { Page = page ?? 1, RowsPerPage = rowsPerPage ?? 10 };
            var (ok, data, total) = await _service.GetAllEpisodeTransferByCycleId(ivfDashboardTreatmentCycleId, pagination);
            if (!ok)
                return BadRequest(new { message = "Unable to fetch transfers" });

            return Ok(new { data, totalRecords = total });
        }

        [HttpDelete("DeleteEpisodeTransfer/{transferId}")]
        public async Task<IActionResult> DeleteEpisodeTransfer([FromRoute] long transferId)
        {
            var (success, message) = await _service.DeleteEpisodeTransferAsync(transferId);
            if (success)
                return Ok(new { message });

            return BadRequest(new { message });
        }
    }
}
