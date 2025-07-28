using Dapper;
using HMIS.Common.ORM;
using HMIS.Service.Implementations;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.ServiceLogics
{
    public class EncounterManager : IEncounterManager
    {
        public async Task<DataSet> GetEncounterByMRNoDB(string MRNo, int? PageNumber, int? PageSize)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@MRNo", MRNo, DbType.String);
                param.Add("@PageNumber", PageNumber, DbType.Int32);
                param.Add("@PageSize", PageSize, DbType.Int32);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("REG_EncounterSchAppointmentGet", param);
                if (ds.Tables[0].Rows.Count == 0)
                {
                    return new DataSet();
                }

                return ds;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }
        }
    }
}
