using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HMIS.Application.DTOs.IVFDTOs;
using HMIS.Application.ServiceLogics.IVF;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMIS.Web.Controllers.IVF
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IVFLabOrdersController : BaseApiController
    {
        private readonly IIVFLabOrderService _service;
        public IVFLabOrdersController(IIVFLabOrderService service)
        {
            _service = service;
        }

        [HttpGet("{orderSetId:long}")]
        public async Task<IActionResult> GetById(long orderSetId)
        {
            var data = await _service.GetOrderSetAsync(orderSetId);
            if (data == null) return NotFound();
            return Ok(data);
        }

        [HttpGet("by-mrno/{mrno:long}")]
        public async Task<IActionResult> GetByMrno(long mrno, [FromQuery] string view = "grid")
        {
            if (string.Equals(view, "headers", StringComparison.OrdinalIgnoreCase))
            {
                var headers = await _service.GetOrderSetsByMrnoAsync(mrno);
                return Ok(headers);
            }
            var rows = await _service.GetOrderGridByMrnoAsync(mrno);
            return Ok(rows);
        }

        [HttpGet("pathology-results/{mrno:long}")]
        public async Task<IActionResult> GetPathologyResults(long mrno, [FromQuery] string? search)
        {
            var rows = await _service.GetPathologyResultsAsync(mrno, search);
            return Ok(rows);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUpdateLabOrderSetDTO payload)
        {
            var id = await _service.CreateOrderSetAsync(payload);
            return CreatedAtAction(nameof(GetById), new { orderSetId = id }, new { orderSetId = id });
        }

        [HttpPut("{orderSetId:long}")]
        public async Task<IActionResult> Update(long orderSetId, [FromBody] CreateUpdateLabOrderSetDTO payload)
        {
            var ok = await _service.UpdateOrderSetAsync(orderSetId, payload);
            return ok ? NoContent() : NotFound();
        }

        [HttpDelete("{orderSetId:long}")]
        public async Task<IActionResult> Delete(long orderSetId, [FromQuery] bool hard = false)
        {
            var ok = await _service.DeleteOrderSetAsync(orderSetId, hard);
            return ok ? NoContent() : NotFound();
        }

        // Dropdowns
        [HttpGet("ref-physicians")]
        public async Task<IActionResult> GetRefPhysicians([FromQuery] int? employeeTypeId)
        {
            var items = await _service.GetRefPhysiciansAsync(employeeTypeId);
            return Ok(items);
        }

        [HttpGet("notify-roles")]
        public async Task<IActionResult> GetNotifyRoles()
        {
            var items = await _service.GetNotifyRolesAsync();
            return Ok(items);
        }

        [HttpGet("receivers")]
        public async Task<IActionResult> GetReceivers([FromQuery] int? employeeTypeId)
        {
            var items = await _service.GetReceiversByEmployeeTypeAsync(employeeTypeId);
            return Ok(items);
        }

        // Collection details
        [HttpGet("{orderSetId:long}/collection-details")]
        public async Task<IActionResult> GetCollectionDetails(long orderSetId)
        {
            var rows = await _service.GetOrderCollectionDetailsAsync(orderSetId);
            if (rows == null) return NotFound();
            return Ok(rows);
        }

        // Sample collection
        [HttpPost("{orderSetDetailId:long}/collect")]
        public async Task<IActionResult> CollectSample(long orderSetDetailId, [FromBody] CollectSampleDTO payload)
        {
            var ok = await _service.CollectSampleAsync(orderSetDetailId, payload);
            return ok ? NoContent() : NotFound();
        }

        [HttpPost("{orderSetDetailId:long}/observations")]
        public async Task<IActionResult> Complete(long orderSetDetailId, [FromBody] CompleteLabOrderDTO payload)
        {
            var labResultId = await _service.CompleteOrderAsync(orderSetDetailId, payload);
            if (labResultId == 0) return NotFound();
            return Ok(new { labResultId });
        }
        [HttpPost("{orderSetId:long}/mark-complete")]
        public async Task<IActionResult> MarkComplete([FromRoute] long orderSetId,[FromBody] LabOrderStatus status)
        {
            var labResultId = await _service.MarkCompleteOrderAsync(orderSetId, status);

            if (labResultId == 0)
                return NotFound("Order set not found or already completed.");

            if (labResultId == -1)
                return BadRequest("Cannot mark as complete until all test samples are collected.");

            return Ok(new { labResultId, orderSetId, status });
        }

        [HttpPost("{orderSetId:long}/cancel")]
        public async Task<IActionResult> CancelOrder(long orderSetId, [FromBody] CancelOrderDTO payload)
        {
            var result = await _service.CancelOrderAsync(orderSetId, payload);
            
            if (result == 0)
                return NotFound("Order not found.");
            
            if (result == -1)
                return BadRequest("Marked complete order cannot be canceled.");
            
            return Ok(new { message = "Order cancelled successfully", orderSetId });
        }
    }
}
