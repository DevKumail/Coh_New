using HMIS.Application.Implementations;
using Microsoft.AspNetCore.Mvc;
using Deepgram;
using Deepgram;
using Deepgram.Models.Manage.v1;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Logging;
using System.Data;
using System.IO.Compression;

namespace HMIS.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize]

    public class LocalizationController : BaseApiController
    {

        private readonly ILocalizationSpService _localizationSpService;
        private readonly IConfiguration _configuration;
        //  TimerElapsed timerElapsed = new TimerElapsed();
        //private readonly IEMRNotesManager _eMRNotesManager;
        public LocalizationController(ILocalizationSpService localizationSpService, IConfiguration configuration)
        {
            _localizationSpService = localizationSpService;
            _configuration = configuration;
            // _eMRNotesManager = eMRNotesManager;
        }

        [HttpGet("CreateJsonFileForLocalization")]
        public IActionResult CreateJsonFileForLocalization()
        {
            try
            {
                var result = _localizationSpService.GenerateLocalizationFiles();

                return Ok("True");

                if (result == "Created")
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {


                return BadRequest();
            }

            // return BadRequest();
        }
    }

}
