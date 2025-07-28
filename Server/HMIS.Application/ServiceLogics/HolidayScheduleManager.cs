using Dapper;
using HMIS.Common.ORM;
using HMIS.Service.DTOs;
using HMIS.Service.Implementations;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.ServiceLogics
{
    public class HolidayScheduleManager : IHolidayScheduleManager
    {
        public async Task<DataSet> GetHolidayScheduleDB()
        {
            try
            {
                DynamicParameters param = new DynamicParameters();



                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("CP_HolidayScheduleGet", param);
                if (ds.Tables[0].Rows.Count == 0)
                {
                    throw new Exception("No data found");
                }

                return ds;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }

        }

        public async Task<DataSet> GetHolidayScheduleByIdDB(long HolidayScheduleId)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@HolidayScheduleId", HolidayScheduleId);



                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("CP_HolidayScheduleGet", param);
                if (ds.Tables[0].Rows.Count == 0)
                {
                    throw new Exception("No data found");
                }

                return ds;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }

        }
        public async Task<bool> InsertHolidayScheduleDB(HolidaySchedule hs)
        {
            try

            {

                DynamicParameters parameters = new DynamicParameters();

                parameters.Add("@IsHoliday", hs.IsHoliday);
                parameters.Add("@HolidayName", hs.HolidayName);
                parameters.Add("@Comments", hs.Comments);
                parameters.Add("@SiteID", hs.SiteID);
                parameters.Add("@Years", hs.Years);
                parameters.Add("@MonthDay", hs.MonthDay);
                parameters.Add("@StartingTime", hs.StartingTime);
                parameters.Add("@EndingTime", hs.EndingTime);
                parameters.Add("@IsActive", hs.IsActive);
                parameters.Add("@CreatedBy", hs.CreatedBy);

                bool res = await DapperHelper.ExcecuteSPByParams("CP_HolidayScheduleInsert", parameters);


                return res;




            }
            catch (Exception ex)
            {
                return false;
            }

        }


        public async Task<bool> UpdateHolidayScheduleDB(HolidaySchedule hs)
        {
            try

            {

                DynamicParameters parameters = new DynamicParameters();

                parameters.Add("@HolidayScheduleId", hs.HolidayScheduleId);
                parameters.Add("@IsHoliday", hs.IsHoliday);
                parameters.Add("@HolidayName", hs.HolidayName);
                parameters.Add("@Comments", hs.Comments);
                parameters.Add("@SiteID", hs.SiteID);
                parameters.Add("@Years", hs.Years);
                parameters.Add("@MonthDay", hs.MonthDay);
                parameters.Add("@StartingTime", hs.StartingTime);
                parameters.Add("@EndingTime", hs.EndingTime);
                parameters.Add("@IsActive", hs.IsActive);
                parameters.Add("@UpdateBy", hs.UpdateBy);


                bool res = await DapperHelper.ExcecuteSPByParams("CP_HolidayScheduleUpdate", parameters);

                return res;
            }
            catch (Exception ex)
            {
                return false;
            }

        }
    }
}
