using AutoMapper;
using HMIS.Application.DTOs.Clinical;
using HMIS.Core.Entities;
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
        private readonly IMapper _mapper;

        TimerElapsed timerElapsed = new TimerElapsed();

        public EMRNotesController(IEMRNotesManager eMRNotesManager, IConfiguration configuration, IMapper mapper)
        {
            _eMRNotesManager = eMRNotesManager;
            _configuration = configuration;
            _mapper = mapper;
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



        [HttpPost("SaveEMRNote")]
        public async Task<IActionResult> SaveEMRNote([FromBody] ClinicalNoteSaveDto noteDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var noteEntity = _mapper.Map<EmrnotesNote>(noteDto);

                var result = await _eMRNotesManager.SaveEMRNote(noteEntity);
                return Ok(new { success = true, data = result, message = "EMR note saved successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Internal Server Error: {ex.Message}" });
            }
        }
        [HttpGet("GetEMRNoteByNoteId/{noteId}")]
        public async Task<IActionResult> GetEMRNoteByNoteId(long noteId)
        {
            try
            {
                if (noteId <= 0)
                {
                    return BadRequest(new { success = false, message = "Valid NoteId is required" });
                }

                var note = await _eMRNotesManager.GetEMRNoteByNoteId(noteId);

                if (note == null)
                {
                    return NotFound(new { success = false, message = $"EMR note with ID {noteId} not found" });
                }

                return Ok(new
                {
                    success = true,
                    data = note,
                    message = "EMR note retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"An error occurred while retrieving the EMR note: {ex.Message}"
                });
            }
        }
            [HttpGet("GetEMRNotesByMRNo")]
        public async Task<IActionResult> GetEMRNotesByMRNo(
    [FromQuery] string mrno,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(mrno))
                {
                    return BadRequest(new { success = false, message = "MRNo is required" });
                }

                if (page < 1)
                {
                    return BadRequest(new { success = false, message = "Page must be greater than 0" });
                }

                if (pageSize < 1 || pageSize > 100)
                {
                    return BadRequest(new { success = false, message = "PageSize must be between 1 and 100" });
                }

                // Call the service method
                var (data, totalCount) = await _eMRNotesManager.GetEMRNotesByMRNo(mrno, page, pageSize);

                // Prepare pagination metadata
                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                return Ok(new
                {
                    success = true,
                    data = data,
                    pagination = new
                    {
                        currentPage = page,
                        pageSize = pageSize,
                        totalCount = totalCount,
                        totalPages = totalPages,
                        hasPrevious = page > 1,
                        hasNext = page < totalPages
                    },
                    message = data.Any() ? "EMR notes retrieved successfully" : "No EMR notes found"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"An error occurred while retrieving EMR notes: {ex.Message}"
                });
            }
        }


    }
}