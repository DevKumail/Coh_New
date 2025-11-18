using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HMIS.Application.ServiceLogics.IVF;
using HMIS.Application.DTOs.SpLocalModel;
using HMIS.Application.DTOs.IVFDTOs;


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

        [HttpGet("GetAllFertilityHistory")]
        public async Task<IActionResult> GetAllFertilityHistory([FromQuery] string ivfmainid, [FromQuery] int? page = 1, [FromQuery] int? rowsPerPage = 10)
        {
            if (string.IsNullOrWhiteSpace(ivfmainid))
                return BadRequest(new { message = "ivfmainid is required" });
            if (!int.TryParse(ivfmainid, out _))
                return BadRequest(new { message = "ivfmainid must be an integer" });
            var pg = page ?? 1;
            var rp = rowsPerPage ?? 10;
            if (pg <= 0 || rp <= 0)
                return BadRequest(new { message = "page and rowsPerPage must be greater than zero" });

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
