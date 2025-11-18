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

        [HttpGet("GetFertilityHistory")]
        public async Task<IActionResult> GetFertilityHistory([FromQuery] string ivfmainid, [FromQuery] int? page = 1, [FromQuery] int? rowsPerPage = 10)
        {
            var fertilityHistory = await _service.GetFertilityHistory(
                ivfmainid, 
                new PaginationInfo { Page = page, RowsPerPage = rowsPerPage
                });
            return Ok(new { fertilityHistory = fertilityHistory.Data });
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
