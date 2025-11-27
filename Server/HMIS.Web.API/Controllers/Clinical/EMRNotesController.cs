using HMIS.Application.DTOs.Clinical;
using HMIS.Service.Implementations;
using HMIS.Web.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace HMIS.API.Controllers.Clinical
{
    [Route("api/[controller]")]
    [ApiController]
    public class EMRNotesController : BaseApiController
    {
        private readonly IEMRNotesManager _eMRNotesManager;
        private readonly IConfiguration _configuration;
        TimerElapsed timerElapsed = new TimerElapsed();

        public EMRNotesController(IEMRNotesManager eMRNotesManager, IConfiguration configuration)
        {
            _eMRNotesManager = eMRNotesManager;
            _configuration = configuration;
        }

        [HttpGet("GetNoteQuestionBYPathId")]
        public async Task<IActionResult> GetNoteQuestionBYPathId(int PathId)
        {
            try
            {
                // ✅ FIX: Added await
                var node = await _eMRNotesManager.GetNoteQuestionBYPathId(PathId);

                return Ok(new
                {
                    node
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpGet("EMRNotesGetByEmpId")]
        public async Task<IActionResult> EMRNotesGetByEmpId(int EmpId)
        {
            try
            {
                // ✅ FIX: Added await
                var result = await _eMRNotesManager.EMRNotesGetByEmpId(EmpId);

                return Ok(new
                {
                    result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPost("InsertSpeech")]
        public async Task<IActionResult> InsertSpeech([FromBody] ClinicalNoteDto note)
        {
            try
            {
                var result = await _eMRNotesManager.InsertSpeechWithTranscription(note);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
}