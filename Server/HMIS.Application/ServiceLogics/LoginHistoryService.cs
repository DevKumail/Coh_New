using Dapper;
using HMIS.Infrastructure.ORM;
using HMIS.Core.Entities;
using HMIS.Application.Implementations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.ServiceLogics
{
    public class LoginHistoryService : ILoginHistoryService
    {

        public void LogHistory(LoginUserHistory userlogin)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@Token", $"{userlogin.Token}");
                param.Add("@LoginUserName", $"{userlogin.LoginUserName}");

                param.Add("@IPAddress", $"{userlogin.Ipaddress}");
                param.Add("@LoginTime", $"{userlogin.LoginTime}");


                param.Add("@LogoffTime", $"{userlogin.LogoffTime}");
                param.Add("@LastActivityTime", $"{userlogin.LastActivityTime}");



                param.Add("@UserLogOut", $"{userlogin.UserLogOut}");
                param.Add("@CreatedOn", $"{userlogin.CreatedOn}");


                param.Add("@CreatedBy", $"{userlogin.CreatedBy}");


                param.Add("@UpdatedOn", $"{userlogin.UpdatedOn}");

                param.Add("@UpdatedBy", $"{userlogin.UpdatedBy}");


                DapperHelper.ExcecuteSPByParams("[dbo].[SEC_LoginHistoryUpdate]", param);



            }
            catch (Exception ex)
            {


            }
        }



    }
}

