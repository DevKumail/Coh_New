using DocumentFormat.OpenXml.Office2010.Excel;
using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Application.DTOs.SpLocalModel;
using HMIS.Application.ServiceLogics.IVF;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace HMIS.Web.Controllers.IVF
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IVFFertilityHistoryController : BaseApiController
    {
        
        private readonly IFertilityHistoryService _service;


        public IVFFertilityHistoryController(IFertilityHistoryService service)
        {
            _service = service;
        }

        [HttpDelete("DeleteFertilityHistoryMale/{IVFMaleFHId}")]
        public async Task<IActionResult> DeleteFertilityHistory([FromRoute]string IVFMaleFHId)
        {
            var userId = User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var (success, message) = await _service.DeleteMaleFertilityHistoryAsync(IVFMaleFHId, userId);

            if (success)
            {
                return Ok(new { message });
            }
            return BadRequest(new { message });
        }
        [HttpGet("GetFertilityHistoryById")]
        public async Task<IActionResult> GetFertilityHistoryById([FromQuery] string IVFMaleFHId)
        {
            if (string.IsNullOrWhiteSpace(IVFMaleFHId))
                return BadRequest(new { message = "IVFMaleFHId is required" });
            if (!int.TryParse(IVFMaleFHId, out _))
                return BadRequest(new { message = "IVFMaleFHId must be an integer" });
           
            var result = await _service.GetFertilityHistoryById(
                IVFMaleFHId);

            if (!result.IsSuccess)
                return BadRequest(new { message = "Unable to fetch fertility history" });

            return Ok(new { fertilityHistory = result.Data });
        }
        
        [HttpGet("GetAllFertilityHistory")]
        public async Task<IActionResult> GetAllFertilityHistory([FromQuery] string ivfmainid, [FromQuery] int? page = 1, [FromQuery] int? rowsPerPage = 10)
        {
            if (string.IsNullOrWhiteSpace(ivfmainid))
                return BadRequest(new { message = "ivfmainid is required" });
            if (!int.TryParse(ivfmainid, out _))
                return BadRequest(new { message = "ivfmainid must be an integer" });
            var pg = page ?? 1;
            var rp = rowsPerPage ?? 10;
            var result = await _service.GetAllFertilityHistory(
                ivfmainid,
                new PaginationInfo { Page = pg, RowsPerPage = rp });

            if (!result.IsSuccess)
                return BadRequest(new { message = "Unable to fetch fertility history" });

            return Ok(new { fertilityHistory = result.Data });
        }
        [HttpPost("CreateUpdateMaleFertilityHistory")]
        public async Task<IActionResult> CreateUpdateMaleFertilityHistory([FromBody] IVFMaleFertilityHistoryDto dto)
        {
            var result = await _service.CreateMaleFertilityHistoryAsync(dto);
            if (!result.IsSuccess) return BadRequest(new { message = result.ErrorMessage });
            return Ok(new { id = result.Data });
        }


    }
}
