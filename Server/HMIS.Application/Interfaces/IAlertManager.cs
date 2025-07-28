using HMIS.Service.DTOs.Clinical;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.Implementations
{
    public interface IAlertManager
    {
        Task<DataSet> GetAlertDeatilsDB(string mrno);

        Task<bool> InsertOrUpdateAlert(Alerts_Model Alert);
        
    }
}
