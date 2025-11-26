using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HMIS.Application.DTOs.SpLocalModel;
using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Application.ServiceLogics.IVF.Dashboard;


namespace HMIS.Web.Controllers.IVF
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IVFDashboardController : BaseApiController
    {
        
        private readonly IDashboardService _service;


        public IVFDashboardController(IDashboardService service)
        {
            _service = service;
        }

        [HttpGet("GetCoupleData")]
        public async Task<IActionResult> GetCoupleData(string mrno)
        {
            var couple = await _service.GetCoupleData(mrno);
            return Ok(new { couple = couple.Data }); 
        }

        [HttpGet("GetOppositeGenderPatients")]
        public async Task<IActionResult> GetOppositeGenderPatients([FromQuery] string gender, [FromQuery] int? page = 1, [FromQuery] int? rowsPerPage = 10, [FromQuery] string? mrno = null, [FromQuery] string? phone = null, [FromQuery] string? emiratesId = null, [FromQuery] string? name = null)
        {
            var (ok, data, total) = await _service.GetOppositeGenderPatients(
                gender,
                new PaginationInfo { Page = page, RowsPerPage = rowsPerPage },
                mrno,
                phone,
                emiratesId,
                name
            );
            if (!ok) return BadRequest("Invalid gender provided.");
            return Ok(new { data, total });
        }

        [HttpGet("GetFertilityHistoryForDashboard")]
        public async Task<IActionResult> GetFertilityHistoryForDashboard([FromQuery] string ivfmainid)
        {
            if (string.IsNullOrWhiteSpace(ivfmainid))
                return BadRequest(new { message = "ivfmainid is required" });

            var (ok, data) = await _service.GetFertilityHistoryForDashboard(ivfmainid);
            if (!ok || data == null)
                return BadRequest(new { message = "Unable to fetch fertility history for dashboard" });

            return Ok(new { fertilityHistory = data });
        }

        [HttpPost("GenerateIVFMain")]
        public async Task<IActionResult> GenerateIVFMain([FromBody] InsertIvfRelationDTO dto)
        {
            var (ok, id, err) = await _service.GenerateIVFMain(dto);
            if (!ok) return BadRequest(new { message = err });
            return Ok(new { id });
        }

        [HttpPost("InsertPatientRelation")]
        public async Task<IActionResult> InsertPatientRelation([FromBody] InsertPatientRelationDTO dto)
        {
            var (ok, id, err) = await _service.InsertPatientRelation(dto);
            if (!ok) return BadRequest(new { message = err });
            return Ok(new { id });
        }


        [HttpGet("GetIVFDashboardTreatmentCycle")]
        public async Task<IActionResult> GetIVFDashboardTreatmentCycle([FromQuery] string ivfDashboardTreatmentEpisodeId)
        {
            if (string.IsNullOrWhiteSpace(ivfDashboardTreatmentEpisodeId))
                return BadRequest(new { message = "ivfDashboardTreatmentEpisodeId is required" });

            var (ok, data) = await _service.GetIVFDashboardTreatmentCycle(ivfDashboardTreatmentEpisodeId);
            if (!ok || data == null)
                return BadRequest(new { message = "Unable to fetch IVF dashboard treatment cycle" });

            return Ok(new { dashboardTreatmentEpisode = data });
        }

        [HttpGet("GetAllIVFDashboardTreatmentCycle")]
        public async Task<IActionResult> GetAllIVFDashboardTreatmentCycle([FromQuery] string ivfmainid, [FromQuery] int? page = 1, [FromQuery] int? rowsPerPage = 10)
        {
            if (string.IsNullOrWhiteSpace(ivfmainid))
                return BadRequest(new { message = "ivfmainid is required" });
            if (!int.TryParse(ivfmainid, out _))
                return BadRequest(new { message = "ivfmainid must be an integer" });

            var pg = page ?? 1;
            var rp = rowsPerPage ?? 10;

            var result = await _service.GetAllIVFDashboardTreatmentCycle(
                ivfmainid,
                new PaginationInfo { Page = pg, RowsPerPage = rp });

            if (!result.IsSuccess)
                return BadRequest(new { message = "Unable to fetch IVF dashboard treatment cycles" });

            return Ok(new { dashboardTreatmentEpisodes = result.Data });
        }

        [HttpPost("CreateUpdateDashboardTreatmentCycle")]
        public async Task<IActionResult> CreateUpdateDashboardTreatmentEpisode([FromBody] IVFDashboardTreatmentEpisodeDto dto)
        {
            var result = await _service.CreateOrUpdateDashboardTreatmentEpisodeAsync(dto);
            if (!result.IsSuccess) return BadRequest(new { message = result.ErrorMessage });
            return Ok(new { id = result.Data });
        }

        [HttpDelete("DeleteIVFDashboardTreatmentCycle/{ivfDashboardTreatmentEpisodeId}")]
        public async Task<IActionResult> DeleteIVFDashboardTreatmentCycle([FromRoute] string ivfDashboardTreatmentEpisodeId)
        {
            var (success, message) = await _service.DeleteDashboardTreatmentEpisodeAsync(ivfDashboardTreatmentEpisodeId);

            if (success)
            {
                return Ok(new { message });
            }

            return BadRequest(new { message });
        }
    }
}
