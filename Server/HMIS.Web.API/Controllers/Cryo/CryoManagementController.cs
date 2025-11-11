using HMIS.Application.DTOs.CryoDTOs;
using HMIS.Application.ServiceLogics.Cryo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMIS.Web.Controllers.Cryo
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CryoManagementController : ControllerBase
    {
        private readonly ICryoManagementService _cryoService;

        public CryoManagementController(ICryoManagementService cryoService)
        {
            _cryoService = cryoService;
        }

        [HttpPost("InsertOrUpdate")]
        public async Task<ActionResult> AddCryoContainer([FromBody] CryoContainerDto containerDto)
        {
            try
            {
                bool success = await _cryoService.InsertOrUpdateCryoContainer(containerDto);
                if (success)
                    return Ok(new { message = "Cryo container created or updated successfully." });
                else
                    return BadRequest(new { message = "Failed to create or update cryo container." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred.", error = ex.Message });
            }
        }

        [HttpGet("GetAll")]
        public async Task<ActionResult> GetAll(int page = 1, int pageSize = 10)
        {
            try
            {
                var result = await _cryoService.GetAllCryoContainers(page, pageSize);

                return Ok(new
                {
                    data = result.Data,
                    totalCount = result.TotalCount
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred.", error = ex.Message });
            }
        }
        [HttpDelete("DeleteContainer/{containerId}")]
        public async Task<ActionResult> DeleteContainer(long containerId, [FromQuery] long? updatedBy = null)
        {
            try
            {
                bool deleted = await _cryoService.DeleteCryoContainer(containerId, updatedBy);
                if (deleted)
                    return Ok(new { message = "Cryo container and its levels deleted (soft) successfully." });
                else
                    return NotFound(new { message = "Cryo container not found or already deleted." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred.", error = ex.Message });
            }
        }

        [HttpGet("GetContainerById")]
        public async Task<ActionResult<CryoContainerDto>> GetContainerById([FromQuery] long ID)
        {
            try
            {
                var container = await _cryoService.GetCryoContainerById(ID);
                if (container == null)
                    return NotFound(new { message = "Cryo container not found." });

                return Ok(container);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred.", error = ex.Message });
            }
        }


    }
}
