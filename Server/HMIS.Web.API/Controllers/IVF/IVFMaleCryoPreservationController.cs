using HMIS.Application.ServiceLogics.IVF;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMIS.Web.Controllers.IVF
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IVFMaleCryoPreservationController : ControllerBase
    {
        private readonly IIVFStrawColorService _strawColorService;

        public IVFMaleCryoPreservationController(IIVFStrawColorService strawColorService)
        {
            _strawColorService = strawColorService;
        }

        [HttpGet("GetAllStrawColors")]
        public async Task<ActionResult> GetAllStrawColors()
        {
            try
            {
                var colors = await _strawColorService.GetAllStrawColors();
                return Ok(new { data = colors });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving straw colors.", error = ex.Message });
            }
        }

        [HttpGet("GetActiveStrawColors")]
        public async Task<ActionResult> GetActiveStrawColors()
        {
            try
            {
                var colors = await _strawColorService.GetActiveStrawColors();
                return Ok(new { data = colors });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving active straw colors.", error = ex.Message });
            }
        }

        [HttpGet("GetStrawColorById/{colorId}")]
        public async Task<ActionResult> GetStrawColorById(int colorId)
        {
            try
            {
                var color = await _strawColorService.GetStrawColorById(colorId);
                if (color == null)
                    return NotFound(new { message = "Straw color not found." });

                return Ok(color);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving straw color.", error = ex.Message });
            }
        }
    }
}