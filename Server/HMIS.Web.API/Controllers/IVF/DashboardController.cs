using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HMIS.Application.ServiceLogics.IVF;


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
    }
}
