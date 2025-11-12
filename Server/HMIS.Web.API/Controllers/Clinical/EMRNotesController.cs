//using Deepgram;
//using HMIS.Common.Logger;
//using HMIS.Service.DTOs;
//using HMIS.Service.DTOs.AppointmentDTOs;
//using HMIS.Service.DTOs.Clinical;
//using HMIS.Service.Implementations;
//using HMIS.Service.ServiceLogics;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.IdentityModel.Logging;
//using System.Data;
//using Deepgram;


using HMIS.Application.Implementations;
using Microsoft.AspNetCore.Mvc;
using Deepgram;
using Deepgram;
using Deepgram.Models.Manage.v1;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Logging;
using System.Data;
using System.IO.Compression;
using HMIS.Web.Controllers;
using HMIS.Service.Implementations;

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
            var node = _eMRNotesManager.GetNoteQuestionBYPathId(PathId);

            //string json = JsonConvert.SerializeObject(result, Formatting.Indented);
            //Console.WriteLine(json);
            return Ok(new
            {
                node
                //Data = drugs,
                //TotalCount = totalCount
            });
        }
        [HttpGet("EMRNotesGetByEmpId")]
        public async Task<IActionResult> EMRNotesGetByEmpId(int EmpId)
        {
            var result = _eMRNotesManager.EMRNotesGetByEmpId(EmpId);

            
            return Ok(new
            {
                result
               
            });
        }

    }
}
