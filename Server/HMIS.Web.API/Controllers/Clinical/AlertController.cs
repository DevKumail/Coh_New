using HMIS.Application.DTOs.Clinical;
using HMIS.Application.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SqlServer.Management.Smo.Agent;

namespace HMIS.Web.Controllers.Clinical
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlertController : ControllerBase
    {
        #region Fields
        private readonly IAlertManager _Alert;

        public AlertController(IAlertManager _alert)
        {
            this._Alert = _alert;
        }
        #endregion

        [HttpGet("GetAlertDeatilsDB")]

        public async Task<ActionResult> GetAlertDeatilsDB(string mrno, int? PageNumber, int? PageSize)

        { var alert = await _Alert.GetAlertDeatilsDB(mrno, PageNumber, PageSize);
            return Ok(new { alert = alert });
        }

        [HttpPost("SubmitAlertType")]

        public async Task<ActionResult> SubmitAlert (Alerts_Model Alert)
        {
            try
            {
                bool success = await _Alert.InsertOrUpdateAlert(Alert);

                if (success)
                {
                    return Ok(new { message = "Patient information created or updated successfully." });
                }

                else
                {
                    return BadRequest(new { message = "Failed to create or update patient information." });
                }
            }
            catch (Exception ex)

            {
                return StatusCode(500, new { message = "An error occurred while processing the request.", error = ex.Message });
            }
            return Ok(new { Alert = "test" });
         }



     } 
 }

