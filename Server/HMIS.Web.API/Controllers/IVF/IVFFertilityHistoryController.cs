using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Application.DTOs.SpLocalModel;
using HMIS.Application.ServiceLogics.IVF.Female;
using HMIS.Application.ServiceLogics.IVF.Male;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace HMIS.Web.Controllers.IVF
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IVFFertilityHistoryController : BaseApiController
    {
        
        private readonly IIVFMaleFertilityHistoryService _maleService;
        private readonly IIVFFemaleFertilityHistoryService _femaleService;


        public IVFFertilityHistoryController(IIVFMaleFertilityHistoryService maleService,IIVFFemaleFertilityHistoryService femaleService)
        {
            _maleService = maleService;
            _femaleService = femaleService;
        }

        [HttpDelete("DeleteMaleFertilityHistory/{IVFMaleFHId}")]
        public async Task<IActionResult> DeleteMaleFertilityHistory([FromRoute]string IVFMaleFHId)
        {
            var userId = User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var (success, message) = await _maleService.DeleteMaleFertilityHistoryAsync(IVFMaleFHId, userId);

            if (success)
            {
                return Ok(new { message });
            }
            return BadRequest(new { message });
        }
        [HttpGet("GetMaleFertilityHistoryById")]
        public async Task<IActionResult> GetMaleFertilityHistoryById([FromQuery] string IVFMaleFHId)
        {
            if (string.IsNullOrWhiteSpace(IVFMaleFHId))
                return BadRequest(new { message = "IVFMaleFHId is required" });
            if (!int.TryParse(IVFMaleFHId, out _))
                return BadRequest(new { message = "IVFMaleFHId must be an integer" });
           
            var result = await _maleService.GetMaleFertilityHistoryById(
                IVFMaleFHId);

            if (!result.IsSuccess)
                return BadRequest(new { message = "Unable to fetch fertility history" });

            return Ok(new { fertilityHistory = result.Data });
        }
        
        [HttpGet("GetAllMaleFertilityHistory")]
        public async Task<IActionResult> GetAllMaleFertilityHistory([FromQuery] string ivfmainid, [FromQuery] int? page = 1, [FromQuery] int? rowsPerPage = 10)
        {
            if (string.IsNullOrWhiteSpace(ivfmainid))
                return BadRequest(new { message = "ivfmainid is required" });
            if (!int.TryParse(ivfmainid, out _))
                return BadRequest(new { message = "ivfmainid must be an integer" });
            var pg = page ?? 1;
            var rp = rowsPerPage ?? 10;
            var result = await _maleService.GetAllMaleFertilityHistory(
                ivfmainid,
                new PaginationInfo { Page = pg, RowsPerPage = rp });

            if (!result.IsSuccess)
                return BadRequest(new { message = "Unable to fetch fertility history" });

            return Ok(new { fertilityHistory = result.Data });
        }
        [HttpPost("CreateUpdateMaleFertilityHistory")]
        public async Task<IActionResult> CreateUpdateMaleFertilityHistory([FromBody] IVFMaleFertilityHistoryDto dto)
        {
            var result = await _maleService.CreateMaleFertilityHistoryAsync(dto);
            if (!result.IsSuccess) return BadRequest(new { message = result.ErrorMessage });
            return Ok(new { id = result.Data });
        }
        [HttpPost("CreateUpdateFemaleFertilityHistory")]
        public async Task<IActionResult> CreateUpdateFemaleFertilityHistory([FromBody] IVFFemaleFertilityHistoryDto dto)
        {
            var result = await _femaleService.CreateOrUpdateFemaleFertilityHistoryAsync(dto);
            if (!result.IsSuccess) return BadRequest(new { message = result.ErrorMessage });
            return Ok(new { id = result.Data });
        }
        [HttpGet("GetFemaleFertilityHistoryById")]
        public async Task<IActionResult> GetFemaleFertilityHistoryById([FromQuery] string IVFFemaleFHId)
        {
            if (string.IsNullOrWhiteSpace(IVFFemaleFHId))
                return BadRequest(new { message = "IVFFemaleFHId is required" });
            if (!int.TryParse(IVFFemaleFHId, out _))
                return BadRequest(new { message = "IVFFemaleFHId must be an integer" });

            var result = await _femaleService.GetFemaleFertilityHistoryById(IVFFemaleFHId);
            if (!result.IsSuccess)
                return BadRequest(new { message = "Unable to fetch fertility history" });

            return Ok(new { fertilityHistory = result.Data });
        }

        [HttpGet("GetAllFemaleFertilityHistory")]
        public async Task<IActionResult> GetAllFemaleFertilityHistory([FromQuery] string ivfmainid, [FromQuery] int? page = 1, [FromQuery] int? rowsPerPage = 10)
        {
            if (string.IsNullOrWhiteSpace(ivfmainid))
                return BadRequest(new { message = "ivfmainid is required" });
            if (!int.TryParse(ivfmainid, out _))
                return BadRequest(new { message = "ivfmainid must be an integer" });

            var pg = page ?? 1;
            var rp = rowsPerPage ?? 10;
            var result = await _femaleService.GetAllFemaleFertilityHistory(
                ivfmainid,
                new PaginationInfo { Page = pg, RowsPerPage = rp });

            if (!result.IsSuccess)
                return BadRequest(new { message = "Unable to fetch fertility history" });

            return Ok(new { fertilityHistory = result.Data });
        }

        [HttpDelete("DeleteFemaleFertilityHistory/{IVFFemaleFHId}")]
        public async Task<IActionResult> DeleteFemaleFertilityHistory([FromRoute] string IVFFemaleFHId)
        {
            var userId = User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var (success, message) = await _femaleService.DeleteFemaleFertilityHistoryAsync(IVFFemaleFHId, userId ?? string.Empty);

            if (success)
            {
                return Ok(new { message });
            }
            return BadRequest(new { message });
        }
    }
}
