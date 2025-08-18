using HMIS.Infrastructure.Helpers;
using HMIS.Infrastructure.Logger;
using HMIS.Core.Entities;
using HMIS.Application.DTOs.CommonDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace HMIS.Web.Controllers.Common
{
    [ApiController]
    [Authorize]

    [Route("api/[controller]")]
    public class CacheController : BaseApiController
    {
        [Route("GetCache")]
        [HttpPost]
        public IActionResult Index([FromBody] CacheRequestModel request)
        {
            try
            {


                var cacheTest = JsonConvert.SerializeObject(CacheHelper.Instance.ReadInMemoryCache(request.Entities));
                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = "Cache > Index", ActionDetails = $"Index > request = {request.ToString()}", ActionId = 1, ActionTime = DateTime.Now, FormName = "Cache", ModuleName = "CacheController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, "Cache > Index");
                return Ok(new { cache = JsonConvert.SerializeObject(CacheHelper.Instance.ReadInMemoryCache(request.Entities)) });

            }
            catch (Exception ex)
            {
                //FILE BASED
                //NLogHelper.WriteLog(new LogParameter() { Message = "Cache exception", ActionDetails = $"Cache > exception = {ex.InnerException} {ex.Message}", ActionId = 1, ActionTime = DateTime.Now, FormName = "Cache", ModuleName = "CacheController.cs", UserName = "System", TablesReadOrModified = 0, UserLoginHistoryId = 17 }, (short)NLog.LogLevel.Info.Ordinal, "Cache > Index");

                return StatusCode(500);
            }


            // re turn View();
        }   
    }
}
