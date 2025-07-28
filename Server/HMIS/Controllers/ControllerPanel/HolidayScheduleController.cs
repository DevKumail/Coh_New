using HMIS.Service.DTOs;
using HMIS.Service.Implementations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace HMIS.API.Controllers.ControllerPanel
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class HolidayScheduleController : BaseApiController
    {
        private readonly IHolidayScheduleManager _manager;
        public HolidayScheduleController(IHolidayScheduleManager manager)
        {
            _manager = manager;
        }

        [HttpGet("GetHolidaySchedule")]
        public async Task<IActionResult> HolidaySchedule()
        {

            DataSet result = await _manager.GetHolidayScheduleDB();
            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet("GetHolidayScheduleById")]
        public async Task<IActionResult> HolidaySchedule(long HolidayScheduleId)
        {

            DataSet result = await _manager.GetHolidayScheduleByIdDB(HolidayScheduleId);
            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpPost("InsertHolidaySchedule")]
        public async Task<IActionResult> InsertHolidaySchedule(HolidaySchedule hs)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            hs.CreatedBy = User.Claims.Where(c => c.Type == "UserName").First().Value;

            var result = await _manager.InsertHolidayScheduleDB(hs);

            if (result)
            {
                return Ok(new { Success = true });
            }

            return BadRequest(result);
        }


        [HttpPut("UpdateHolidayScheduleByHSId")]
        public async Task<IActionResult> UpdateHolidaySchedule(HolidaySchedule hs)
        {
            hs.UpdateBy = User.Claims.Where(c => c.Type == "UserName").First().Value;

            var result = await _manager.UpdateHolidayScheduleDB(hs);

            if (result)
            {
                return Ok(new { Success = true });
            }

            return BadRequest(result);
        }
    }
}
