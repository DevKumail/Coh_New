using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HMIS.Application.ServiceLogics.IVF;
using System;
using System.Threading.Tasks;

namespace HMIS.Web.Controllers.IVF
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IVFLabTestsController : BaseApiController
    {
        private readonly IIVFLabService _service;
        public IVFLabTestsController(IIVFLabService service)
        {
            _service = service;
        }

        // GET: /api/IVFLabTests/Tree?investigationTypeId=23&laboratoryId=<guid>
        [HttpGet("Tree")]
        public async Task<IActionResult> GetTree([FromQuery] int? investigationTypeId, [FromQuery] int? laboratoryId)
        {
            var result = await _service.GetLabTestTree(investigationTypeId, laboratoryId);
            return Ok(result);
        }
    }
}
