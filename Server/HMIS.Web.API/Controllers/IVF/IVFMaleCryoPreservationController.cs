using HMIS.Application.ServiceLogics.IVF;
using HMIS.Core.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMIS.Web.Controllers.IVF
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IVFMaleCryoPreservationController : ControllerBase
    {
        private readonly IIVFStrawColorService _strawColorService;
        private readonly IIVFMaleCryoPreservationService _cryoPreservationService;

        public IVFMaleCryoPreservationController(IIVFStrawColorService strawColorService, IIVFMaleCryoPreservationService cryoPreservationService)
        {
            _strawColorService = strawColorService;
            _cryoPreservationService = cryoPreservationService;
        }

        [HttpGet("GetAllStrawColors")]
        public async Task<ActionResult> GetAllStrawColors()
        {
            try
            {
                var colors = await _strawColorService.GetAllStrawColors();
                return Ok(new { data = colors });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving straw colors.", error = ex.Message });
            }
        }

        [HttpGet("GetActiveStrawColors")]
        public async Task<ActionResult> GetActiveStrawColors()
        {
            try
            {
                var colors = await _strawColorService.GetActiveStrawColors();
                return Ok(new { data = colors });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving active straw colors.", error = ex.Message });
            }
        }

        [HttpGet("GetStrawColorById/{colorId}")]
        public async Task<ActionResult> GetStrawColorById(int colorId)
        {
            try
            {
                var color = await _strawColorService.GetStrawColorById(colorId);
                if (color == null)
                    return NotFound(new { message = "Straw color not found." });

                return Ok(color);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving straw color.", error = ex.Message });
            }
        }

            [HttpGet("GetAllCryoPreservations")]
            public async Task<ActionResult> GetAllCryoPreservations()
            {
                try
                {
                    var preservations = await _cryoPreservationService.GetAllCryoPreservations();
                    return Ok(new { data = preservations });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "An error occurred while retrieving cryo preservations.", error = ex.Message });
                }
            }

            [HttpGet("GetCryoPreservationById/{cryoPreservationId}")]
            public async Task<ActionResult> GetCryoPreservationById(int cryoPreservationId)
            {
                try
                {
                    var preservation = await _cryoPreservationService.GetCryoPreservationById(cryoPreservationId);
                    if (preservation == null)
                        return NotFound(new { message = "Cryo preservation record not found." });

                    return Ok(preservation);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "An error occurred while retrieving cryo preservation.", error = ex.Message });
                }
            }

            [HttpGet("GetCryoPreservationsBySampleId/{sampleId}")]
            public async Task<ActionResult> GetCryoPreservationsBySampleId(int sampleId)
            {
                try
                {
                    var preservations = await _cryoPreservationService.GetCryoPreservationsBySampleId(sampleId);
                    return Ok(new { data = preservations });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "An error occurred while retrieving cryo preservations for sample.", error = ex.Message });
                }
            }

            [HttpPost("CreateCryoPreservation")]
            public async Task<ActionResult> CreateCryoPreservation([FromBody] IVFMaleCryoPreservationCreateDto preservationDto)
            {
                try
                {
                    var result = await _cryoPreservationService.CreateCryoPreservation(preservationDto);
                    if (result)
                        return Ok(new { message = "Cryo preservation created successfully." });

                    return BadRequest(new { message = "Failed to create cryo preservation." });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "An error occurred while creating cryo preservation.", error = ex.Message });
                }
            }

            [HttpPut("UpdateCryoPreservation")]
            public async Task<ActionResult> UpdateCryoPreservation([FromBody] IVFMaleCryoPreservationUpdateDto preservationDto)
            {
                try
                {
                    var result = await _cryoPreservationService.UpdateCryoPreservation(preservationDto);
                    if (result)
                        return Ok(new { message = "Cryo preservation updated successfully." });

                    return BadRequest(new { message = "Failed to update cryo preservation." });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "An error occurred while updating cryo preservation.", error = ex.Message });
                }
            }

            [HttpDelete("DeleteCryoPreservation/{cryoPreservationId}/{updatedBy}")]
            public async Task<ActionResult> DeleteCryoPreservation(int cryoPreservationId, int? updatedBy)
            {
                try
                {
                    var result = await _cryoPreservationService.DeleteCryoPreservation(cryoPreservationId, updatedBy);
                    if (result)
                        return Ok(new { message = "Cryo preservation deleted successfully." });

                    return BadRequest(new { message = "Failed to delete cryo preservation." });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "An error occurred while deleting cryo preservation.", error = ex.Message });
                }
            }

            [HttpGet("GetAvailableStorageLocations")]
            public async Task<ActionResult> GetAvailableStorageLocations()
            {
                try
                {
                    var locations = await _cryoPreservationService.GetAvailableStorageLocations();
                    return Ok(new { data = locations });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "An error occurred while retrieving available storage locations.", error = ex.Message });
                }
            }

            [HttpGet("GetNextAvailableStorageSlot")]
            public async Task<ActionResult> GetNextAvailableStorageSlot()
            {
                try
                {
                    var slot = await _cryoPreservationService.GetNextAvailableStorageSlot();
                    return Ok(slot);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "An error occurred while retrieving next available storage slot.", error = ex.Message });
                }
            }

            [HttpPost("AssignStorageLocation/{cryoPreservationId}/{storageLevelCId}/{updatedBy}")]
            public async Task<ActionResult> AssignStorageLocation(int cryoPreservationId, long storageLevelCId, int? updatedBy)
            {
                try
                {
                    var result = await _cryoPreservationService.AssignStorageLocation(cryoPreservationId, storageLevelCId, updatedBy);
                    if (result)
                        return Ok(new { message = "Storage location assigned successfully." });

                    return BadRequest(new { message = "Failed to assign storage location." });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "An error occurred while assigning storage location.", error = ex.Message });
                }
            }

            [HttpPost("GenerateStraws/{cryoPreservationId}/{startNumber}/{count}/{createdBy}")]
            public async Task<ActionResult> GenerateStraws(int cryoPreservationId, int startNumber, int count, int? createdBy)
            {
                try
                {
                    var result = await _cryoPreservationService.GenerateStraws(cryoPreservationId, startNumber, count, createdBy);
                    if (result)
                        return Ok(new { message = "Straws generated successfully." });

                    return BadRequest(new { message = "Failed to generate straws." });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "An error occurred while generating straws.", error = ex.Message });
                }
            }
        }
    }
