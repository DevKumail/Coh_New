using HMIS.Application.DTOs.IVFDTOs.EpisodeDto.Overview;
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

        public OverviewController(IEventService eventService, IPrescriptionMasterService prescriptionService, IPrescriptionService service)
        {
            _eventService = eventService;
            _prescriptionMasterService = prescriptionService;
            _prescriptionService = service;
        }


        //----------------- Events start -----------------

        [HttpPost("event-create")]
        public async Task<IActionResult> CreateEvent(EventCreateDto dto)
        {
            var result = await _eventService.CreateEvent(dto);

            if (!result.isSuccess)
                return BadRequest(result.message);

            return Ok(result.message);
        }

        [HttpPut("event-update/{eventId}")]
        public async Task<IActionResult> UpdateEvent(int eventId, EventCreateDto dto)
        {
            var result = await _eventService.UpdateEvent(eventId, dto);

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

        [HttpPost("prescription-master-create")]
        public async Task<IActionResult> CreateMasterPrescription([FromBody] CreateMasterPrescriptionDto dto)
        {
            var result = await _prescriptionMasterService.CreatePrescription(dto);

            if (!result.isSuccess)
                return BadRequest(result.message);

            return Ok(result.message);
        }

        [HttpPut("prescription-master-update")]
        public async Task<IActionResult> UpdateMasterPrescription([FromBody] CreateMasterPrescriptionDto dto)
        {
            var result = await _prescriptionMasterService.UpdatePrescription(dto);

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

        [HttpPost("create")]
        public async Task<IActionResult> CreatePrescription([FromBody] CreatePrescriptiondto dto)
        {
            var result = await _prescriptionService.CreatePrescription(dto);

            if (!result.isSuccess)
                return BadRequest(result.message);

            return Ok(result.message);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdatePrescription([FromBody] CreatePrescriptiondto dto)
        {
            var result = await _prescriptionService.UpdatePrescription(dto);

            if (!result.isSuccess)
                return BadRequest(result.message);

            return Ok(result.message);
        }


        [HttpDelete("delete/{prescriptionId}")]
        public async Task<IActionResult> DeletePrescription(long prescriptionId)
        {
            var result = await _prescriptionService.DeletePrescription(prescriptionId);

            if (!result.isSuccess)
                return BadRequest(result.message);

            return Ok(result.message);
        }

        //----------------- Prescription end -----------------
    }
}
