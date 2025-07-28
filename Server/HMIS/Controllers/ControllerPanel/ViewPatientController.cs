using Dapper;
using HMIS.Common.ORM;
using HMIS.Data.Models;
using HMIS.Service.DTOs;
using HMIS.Service.Implementations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Configuration;
using System.Data;
using System.IO;
using System.Reflection.Emit;
using System.Security.Policy;



namespace HMIS.API.Controllers.ControllerPanel
{
    public class ViewPatientController : BaseApiController
    {
        #region Fields
        private readonly IProviderScheduleManager _providerSceduleManager;
        private readonly IConfiguration _configuration;
        TimerElapsed timerElapsed = new TimerElapsed();
        #endregion

        #region Ctor
        public ViewPatientController(
           IConfiguration configuration,
           IProviderScheduleManager providerScheduleManager)
        {
            _configuration = configuration;
            this._providerSceduleManager = providerScheduleManager;
        }
        #endregion
    }



}
