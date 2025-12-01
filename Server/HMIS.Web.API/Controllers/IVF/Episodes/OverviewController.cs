using HMIS.Application.DTOs.IVFDTOs.EpisodeDto.Overview;
using HMIS.Application.DTOs.SpLocalModel;
using HMIS.Application.ServiceLogics.IVF.Episode.Overview;
using HMIS.Application.ServiceLogics.IVF.Episodes.Overview;
using Microsoft.AspNetCore.Mvc;

namespace HMIS.Web.Controllers.IVF.Episodes
{
    [Route("api/[controller]")]
    [ApiController]
    public class OverviewController : ControllerBase
    {
        private readonly IEventService _eventService;
        private readonly IPrescriptionMasterService _prescriptionMasterService;
        private readonly IPrescriptionService _prescriptionService;
        private readonly IOverviewService _overviewService;

        public OverviewController(IEventService eventService, IPrescriptionMasterService prescriptionService, IPrescriptionService service, IOverviewService overviewService)
        {
            _eventService = eventService;
            _prescriptionMasterService = prescriptionService;
            _prescriptionService = service;
            _overviewService = overviewService;
        }


        //----------------- Events start -----------------

        [HttpPost("event-save")]
        public async Task<IActionResult> SaveEvent(EventCreateDto dto)
        {
            var result = await _eventService.SaveEvent(dto);

            if (!result.isSuccess)
                return BadRequest(result.message);

            return Ok(result.message);
        }


        [HttpDelete("event-delete/{eventId}")]
        public async Task<IActionResult> DeleteEvent(int eventId)
        {
            var result = await _eventService.DeleteEvent(eventId);

            if (!result.isSuccess)
                return BadRequest(result.message);

            return Ok(result.message);
        }

        //----------------- Events end -----------------

        //----------------- Prescription Master start -----------------

        [HttpPost("prescription-master-save")]
        public async Task<IActionResult> SaveMasterPrescription([FromBody] CreateMasterPrescriptionDto dto)
        {
            var result = await _prescriptionMasterService.SaveMasterPrescription(dto);

            if (!result.isSuccess)
                return BadRequest(result.message);

            return Ok(result.message);
        }

        [HttpDelete("prescription-master-delete/{prescriptionId}")]
        public async Task<IActionResult> DeleteMasterPrescription(long prescriptionId)
        {
            var result = await _prescriptionMasterService.DeletePrescription(prescriptionId);

            if (!result.isSuccess)
                return BadRequest(result.message);

            return Ok(result.message);
        }

        //----------------- Prescription Master end -----------------

        //----------------- Prescription Start -----------------

        [HttpPost("prescription-save")]
        public async Task<IActionResult> SavePrescription([FromBody] CreatePrescriptiondto dto)
        {
            var result = await _prescriptionService.SavePrescription(dto);

            if (!result.isSuccess)
                return BadRequest(result.message);

            return Ok(result.message);
        }


        [HttpDelete("prescription-delete/{prescriptionId}")]
        public async Task<IActionResult> DeletePrescription(long prescriptionId)
        {
            var result = await _prescriptionService.DeletePrescription(prescriptionId);

            if (!result.isSuccess)
                return BadRequest(result.message);

            return Ok(result.message);
        }

        //----------------- Prescription end -----------------

        //----------------- Overview start ---------------


        [HttpGet("getalldrugs")]
        public async Task<IActionResult> GetAllDrugsDetail([FromQuery] string? keyword,[FromQuery] int? page, [FromQuery] int? RowsPerPage)
        {
            PaginationInfo dto = new PaginationInfo { Page = page, RowsPerPage = RowsPerPage };
            var result = await _prescriptionMasterService.GetAllDrugs(keyword,dto);
            return Ok(result);
        }

        [HttpGet("get-all-Overview/{treatmentCycleId}")]
        public async Task<IActionResult> GetAllOverviewDetail(long treatmentCycleId)
        {
            var result = await _overviewService.GetOverviewByTreatmentCycleAsync(treatmentCycleId);
            return Ok(result);
        }

        //----------------- Overview end -----------------
    }
}
