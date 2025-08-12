using Microsoft.AspNetCore.Mvc;

namespace HMIS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PingController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new
            {
                status = "OK",
                timestamp = DateTime.UtcNow
            });
        }
    }
}   