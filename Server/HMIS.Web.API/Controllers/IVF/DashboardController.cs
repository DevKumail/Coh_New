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
    }
}
