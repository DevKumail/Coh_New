using Dapper;
using HMIS.Infrastructure.ORM;
using HMIS.Application.Implementations;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.ServiceLogics
{
    public class WelcomeScreenManager : IWelcomeScreenManager
    {
        #region GetWelcomeScreen

        public async Task<DataSet> TaskToDoGetDB(long ReceiverId, long? ReceiverRoleId, string FacilityIds, int pageNumber = 1, int pageSize = 10)
        {
            try
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@ReceiverId", ReceiverId, DbType.Int64);
                parameters.Add("@ReceiverRoleId", ReceiverRoleId, DbType.Int64);
                parameters.Add("@FacilityIds", FacilityIds, DbType.String, ParameterDirection.Input, -1);
                parameters.Add("@PageNumber", pageNumber, DbType.Int32);
                parameters.Add("@PageSize", pageSize, DbType.Int32);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("TaskToDoGet", parameters);


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


        public async Task<DataSet> PersonalRemindersGetDB(long employeeId, int pageNumber = 1, int pageSize = 10, string sortColumn = "ReminderDateTime", string sortOrder = "DESC")
        {
            try
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@EmployeeId", employeeId, DbType.Int64);
                parameters.Add("@PageNumber", pageNumber, DbType.Int32);
                parameters.Add("@PageSize", pageSize, DbType.Int32);
                parameters.Add("@SortColumn", sortColumn, DbType.String);
                parameters.Add("@SortOrder", sortOrder, DbType.String);


                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("PersonalRemindersGet", parameters);

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


        public async Task<DataSet> SchAppointmentsLoadDB(DateTime fromDate, DateTime toDate, long providerId, int siteId, string facilityId, int pageNumber = 1, int pageSize = 10)
        {
            try
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@FromDate", fromDate, DbType.DateTime);
                parameters.Add("@ToDate", toDate, DbType.DateTime);
                parameters.Add("@ProviderId", providerId, DbType.Int64);
                parameters.Add("@SiteId", siteId, DbType.Int32);
                parameters.Add("@FacilityID", facilityId, DbType.String);
                parameters.Add("@PageNumber", pageNumber, DbType.Int32);
                parameters.Add("@PageSize", pageSize, DbType.Int32);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("SchAppointmentsLoad", parameters);

                if (ds == null || ds.Tables == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
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

        #endregion

        #region Insert,Update,Delete(Reminder)
        public async Task<bool> InsertReminderDB(int employeeId, string reminderText, DateTime reminderDateTime, string createdBy)
        {
            try
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@EmployeeId", employeeId, DbType.Int32);
                parameters.Add("@ReminderText", reminderText, DbType.String);
                parameters.Add("@ReminderDateTime", reminderDateTime, DbType.DateTime);
                parameters.Add("@CreatedBy", createdBy, DbType.String);

                bool res = await DapperHelper.ExcecuteSPByParams("CP_InsertPersonalReminder", parameters);

                return res;
            }
            catch (Exception ex)
            {
                return false;
            }
        }


        public async Task<bool> UpdatePersonalReminderDB(int reminderId, int employeeId, string reminderText, DateTime reminderDateTime, string updatedBy)
        {
            try
            {


                var parameters = new DynamicParameters();
                parameters.Add("@ReminderId", reminderId, DbType.Int32);
                parameters.Add("@EmployeeId", employeeId, DbType.Int32);
                parameters.Add("@ReminderText", reminderText, DbType.String, size: 300);
                parameters.Add("@ReminderDateTime", reminderDateTime, DbType.DateTime);
                parameters.Add("@UpdatedBy", updatedBy, DbType.String, size: 50);


                bool res = await DapperHelper.ExcecuteSPByParams("CP_UpdatePersonalReminder", parameters);

                if (res) // one row affected indicates successful update
                {
                    return true;
                }
                else
                {
                    return false;
                }

            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> DeletePersonalReminderDB(int reminderId)
        {
            try
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@ReminderId", reminderId, DbType.Int32);
                parameters.Add("@Success", dbType: DbType.Boolean, direction: ParameterDirection.Output);

                await DapperHelper.ExcecuteSPByParams("CP_DeletePersonalReminder", parameters);

                bool success = parameters.Get<bool>("@Success");

                return success;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        #endregion



    }
}
