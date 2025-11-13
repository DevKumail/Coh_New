// Controllers/DropDownLookUpController.cs
using HMIS.Application.DTOs.Configurations;
using HMIS.Application.ServiceLogics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMIS.Web.Controllers.Configuration
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DropDownLookUpController : ControllerBase
    {
        private readonly IDropDownLookUpService _dropDownService;

        public DropDownLookUpController(IDropDownLookUpService dropDownService)
        {
            _dropDownService = dropDownService;
        }

        // Category APIs

        [HttpGet("GetAllCategories")]
        public async Task<ActionResult> GetAllCategories(int page = 1, int pageSize = 10)
        {
            try
            {
                var categories = await _dropDownService.GetAllCategoriesAsync(page, pageSize);
                return Ok(new { data = categories });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching categories.", error = ex.Message });
            }
        }

        [HttpGet("GetCategoryById/{categoryId}")]
        public async Task<ActionResult> GetCategoryById(long categoryId)
        {
            try
            {
                var category = await _dropDownService.GetCategoryByIdAsync(categoryId);
                if (category == null)
                    return NotFound(new { message = "Category not found." });

                return Ok(new { data = category });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching category.", error = ex.Message });
            }
        }

        [HttpPost("CreateOrUpdateCategory")]
        public async Task<ActionResult> CreateOrUpdateCategory([FromBody] DropDownCategoryDto categoryDto)
        {
            try
            {
                bool success = await _dropDownService.CreateOrUpdateCategoryAsync(categoryDto);
                if (success)
                    return Ok(new { message = "Category created or updated successfully." });
                else
                    return BadRequest(new { message = "Failed to create or update category." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred.", error = ex.Message });
            }
        }

        [HttpDelete("DeleteCategory/{categoryId}")]
        public async Task<ActionResult> DeleteCategory(long categoryId, [FromQuery] long? updatedBy)
        {
            try
            {
                bool success = await _dropDownService.DeleteCategoryAsync(categoryId, updatedBy);
                if (success)
                    return Ok(new { message = "Category deleted successfully." });
                else
                    return NotFound(new { message = "Category not found." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting category.", error = ex.Message });
            }
        }

        // Configuration APIs

        [HttpGet("GetConfigurationsByCategory/{categoryId}")]
        public async Task<ActionResult> GetConfigurationsByCategoryId(long categoryId)
        {
            try
            {
                var configurations = await _dropDownService.GetConfigurationsByCategoryIdAsync(categoryId);
                return Ok(new { data = configurations });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching configurations.", error = ex.Message });
            }
        }

        [HttpGet("GetConfigurationById/{valueId}")]
        public async Task<ActionResult> GetConfigurationById(long valueId)
        {
            try
            {
                var configuration = await _dropDownService.GetConfigurationByIdAsync(valueId);
                if (configuration == null)
                    return NotFound(new { message = "Configuration not found." });

                return Ok(new { data = configuration });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching configuration.", error = ex.Message });
            }
        }

        [HttpPost("CreateOrUpdateConfiguration")]
        public async Task<ActionResult> CreateOrUpdateConfiguration([FromBody] DropDownConfigurationDto configurationDto)
        {
            try
            {
                bool success = await _dropDownService.CreateOrUpdateConfigurationAsync(configurationDto);
                if (success)
                    return Ok(new { message = "Configuration created or updated successfully." });
                else
                    return BadRequest(new { message = "Failed to create or update configuration." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred.", error = ex.Message });
            }
        }

        [HttpDelete("DeleteConfiguration/{valueId}")]
        public async Task<ActionResult> DeleteConfiguration(long valueId, [FromQuery] long? updatedBy)
        {
            try
            {
                bool success = await _dropDownService.DeleteConfigurationAsync(valueId, updatedBy);
                if (success)
                    return Ok(new { message = "Configuration deleted successfully." });
                else
                    return NotFound(new { message = "Configuration not found." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting configuration.", error = ex.Message });
            }
        }

        // Combined APIs

        [HttpGet("GetCategoryWithValues/{categoryId}")]
        public async Task<ActionResult> GetCategoryWithValues(long categoryId)
        {
            try
            {
                var categoryWithValues = await _dropDownService.GetCategoryWithValuesAsync(categoryId);
                if (categoryWithValues == null)
                    return NotFound(new { message = "Category not found." });

                return Ok(new { data = categoryWithValues });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching category with values.", error = ex.Message });
            }
        }

        [HttpGet("GetAllCategoriesWithValues")]
        public async Task<ActionResult> GetAllCategoriesWithValues()
        {
            try
            {
                var categoriesWithValues = await _dropDownService.GetAllCategoriesWithValuesAsync();
                return Ok(new { data = categoriesWithValues });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching categories with values.", error = ex.Message });
            }
        }
    }
}