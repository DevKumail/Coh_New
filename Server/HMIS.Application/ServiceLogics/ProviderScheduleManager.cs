using Dapper;
using HMIS.Infrastructure.ORM;
using HMIS.Infrastructure.Repository;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using HMIS.Core.Entities;
using Task = System.Threading.Tasks.Task;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using HMIS.Application.Implementations;
using HMIS.Infrastructure.Helpers;
using HMIS.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Security.AccessControl;
using static HMIS.Application.DTOs.SpLocalModel.ProviderScheduleModel;

namespace HMIS.Application.ServiceLogics
{
    public class ProviderScheduleManager : IProviderScheduleManager
    {
        private readonly HMISDbContext _context;
        public ProviderScheduleManager(HMISDbContext context)
        {
            _context = context;
        }

        public async Task<DataSet> GetProviderFacilityDB(long ProviderId)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@ProviderId", ProviderId, DbType.Int64);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("CP_ProviderFacilityDetailsGet", param);
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

        public async Task<DataSet> GetProviderSiteDB(int FacilityId)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@FacilityId", FacilityId, DbType.Int64);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("CP_SiteByFacilityIdGet", param);
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

        public async Task<DataSet> GetProviderScheduleListDB(FilterProviderScheduleListRequest request)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@ProviderId", request.ProviderScheduleList.ProviderId.HasValue ? request.ProviderScheduleList.ProviderId.Value : -1, DbType.Int64);
                param.Add("@SiteId", request.ProviderScheduleList.SiteId.HasValue ? request.ProviderScheduleList.SiteId.Value : -1, DbType.Int32);
                param.Add("@SpecialityId", request.ProviderScheduleList.SpecialityId.HasValue ? request.ProviderScheduleList.SpecialityId.Value : -1, DbType.Int32);
                param.Add("@FacilityId", request.ProviderScheduleList.FacilityId.HasValue ? request.ProviderScheduleList.FacilityId.Value : -1, DbType.Int32);
                param.Add("@UsageId", request.ProviderScheduleList.UsageId.HasValue ? request.ProviderScheduleList.UsageId.Value : -1, DbType.Int32);
                param.Add("@Priority", request.ProviderScheduleList.Priority.HasValue ? request.ProviderScheduleList.Priority.Value : -1, DbType.Int32);
                param.Add("@Sunday", request.ProviderScheduleList.Sunday, DbType.Boolean);
                param.Add("@Monday", request.ProviderScheduleList.Monday, DbType.Boolean);
                param.Add("@Tuesday", request.ProviderScheduleList.Tuesday, DbType.Boolean);
                param.Add("@Wednesday", request.ProviderScheduleList.Wednesday, DbType.Boolean);
                param.Add("@Thursday", request.ProviderScheduleList.Thursday, DbType.Boolean);
                param.Add("@Friday", request.ProviderScheduleList.Friday, DbType.Boolean);
                param.Add("@Saturday", request.ProviderScheduleList.Saturday, DbType.Boolean);
                param.Add("@StartTime", string.IsNullOrEmpty(request.ProviderScheduleList.StartTime) ? null : request.ProviderScheduleList.StartTime, DbType.String);
                param.Add("@EndTime", string.IsNullOrEmpty(request.ProviderScheduleList.EndTime) ? null : request.ProviderScheduleList.EndTime, DbType.String);
                param.Add("@OffsetValue", request.ProviderScheduleList.OffsetValue, DbType.Int32);
                param.Add("@PagingSize", request.ProviderScheduleList.PagingSize, DbType.Int32);

                param.Add("@Page", request.PaginationInfo.Page, DbType.Int32);
                param.Add("@PageSize", request.PaginationInfo.RowsPerPage, DbType.Int32);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("CP_ProviderScheduleListGet", param);
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
        public async Task<DataSet> GetViewPatientDB(int? MRNo, string? PatientName, DateTime? AppDate, string? AppType, int? PatientStatus)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@MRNo", MRNo.HasValue ? MRNo.Value : -1, DbType.Int64);
                param.Add("@AppDate", AppDate.HasValue ? AppDate.Value : -1, DbType.DateTime);
                param.Add("@AppType", AppType, DbType.String);
                param.Add("@PatientStatus", PatientStatus.HasValue ? PatientStatus.Value : -1, DbType.Int32);
                param.Add("@Patient_Name", PatientName, DbType.String);






                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("Sch_ViewPatientStatus", param);
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


        public async Task<DataSet> GetViewPatientStatusDB(int? MRNo)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@MRNo", MRNo.HasValue ? MRNo.Value : -1, DbType.Int32);
                //param.Add("@PatientNo", PatientNo.HasValue ? PatientNo.Value : -1, DbType.Int64);
                //param.Add("@PatientName", PatientName, DbType.String);
                //param.Add("@startDate", StartDate.HasValue ? StartDate.Value : -1, DbType.DateTime);
                //param.Add("@EndDate", EndDate.HasValue ? EndDate.Value : -1, DbType.DateTime);
                //param.Add("@AppoimentType", AppoimentType, DbType.String);
                //param.Add("@PatientStatus", PatientStatus, DbType.String);


                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("REG_PatientStatusByMRNo", param);
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

        public async Task<DataSet> GetProviderScheduleDB(long ProviderId, int SiteId, int FacilityId, int UsageId)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@ProviderId", ProviderId, DbType.Int64);
                param.Add("@SiteId", SiteId, DbType.Int32);
                param.Add("@FacilityId", FacilityId, DbType.Int32);
                param.Add("@UsageId", UsageId, DbType.Int32);
                param.Add("@PSIdOut", SqlDbType.VarChar, (DbType?)ParameterDirection.Output);


                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("CP_ProviderScheduleGet", param);
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

        public async Task<DataSet> GetProviderSingleScheduleDB(long PSId)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@PSId", PSId, DbType.Int64);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("CP_ProviderSingleScheduleGet", param);
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

        public async Task<bool> InsertProviderScheduleDB(DTOs.ProviderSchedule ps)
        {
            try
            {

                var chkPriority = await Task.Run(() => _context.ProviderSchedules.Where(x => x.ProviderId.Equals(ps.ProviderId)).OrderByDescending(x => x.Psid).Select(x => x.Priority).FirstOrDefaultAsync());
                if (chkPriority != null) { ps.Priority = chkPriority + 1; }
                else { ps.Priority = 0; }
                Core.Entities.ProviderSchedule providerSchedule = new Core.Entities.ProviderSchedule()
                {
                    ProviderId = ps.ProviderId,
                    SiteId = ps.SiteId,
                    UsageId = ps.UsageId,
                    StartTime = ps.StartTime,
                    EndTime = ps.EndTime,
                    StartDate = ps.StartDate,
                    EndDate = ps.EndDate,
                    BreakStartTime = ps.BreakStartTime,
                    BreakEndTime = ps.BreakEndTime,
                    BreakReason = ps.BreakReason,
                    AppPerHour = ps.AppPerHour,
                    MaxOverloadApps = ps.MaxOverloadApps,
                    Priority = ps.Priority,
                    Active = ps.Active,
                    CreatedBy = ps.CreatedBy,
                    UpdatedBy = ps.UpdatedBy,
                    Sunday = ps.Sunday,
                    Monday = ps.Monday,
                    Tuesday = ps.Tuesday,
                    Wednesday = ps.Wednesday,
                    Thursday = ps.Thursday,
                    Friday = ps.Friday,
                    Saturday = ps.Saturday,
                    IsDeleted = false,
                    SpecialityId = ps.SpecialityId
                };
                if (ps.providerScheduleByAppType != null && ps.providerScheduleByAppType.Count > 0)
                {
                    foreach (var item in ps.providerScheduleByAppType)
                    {
                        Core.Entities.ProviderScheduleByAppType psa = new Core.Entities.ProviderScheduleByAppType()
                        {
                            IsDeleted = false,
                            AppTypeId = (int?)item.AppTypeId,
                            CptgroupId = item.CPTGroupId,
                            Duration = item.Duration,
                        };
                        providerSchedule.ProviderScheduleByAppTypes.Add(psa);
                    }
                }
                await _context.ProviderSchedules.AddAsync(providerSchedule);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }

        }

        public async Task<bool> UpdateProviderScheduleDB(DTOs.ProviderSchedule ps)
        {
            try
            {
                var chkResult = await Task.Run(() => _context.ProviderSchedules.Include(c => c.ProviderScheduleByAppTypes).Where(x => x.Psid == ps.PSId && x.IsDeleted == false).FirstOrDefaultAsync());
                if (chkResult != null && chkResult.Psid > 0)
                {

                    chkResult.Psid = ps.PSId;
                    chkResult.FacilityId = ps.FacilityId;
                    chkResult.ProviderId = ps.ProviderId;
                    chkResult.SiteId = ps.SiteId;
                    chkResult.UsageId = ps.UsageId;
                    chkResult.StartTime = ps.StartTime;
                    chkResult.EndTime = ps.EndTime;
                    chkResult.StartDate = ps.StartDate;
                    chkResult.EndDate = ps.EndDate;
                    chkResult.BreakStartTime = ps.BreakStartTime;
                    chkResult.BreakEndTime = ps.BreakEndTime;
                    chkResult.BreakReason = ps.BreakReason;
                    chkResult.AppPerHour = ps.AppPerHour;
                    chkResult.MaxOverloadApps = ps.MaxOverloadApps;
                    chkResult.Priority = chkResult.Priority;
                    chkResult.Active = ps.Active;
                    chkResult.CreatedBy = ps.CreatedBy;
                    chkResult.UpdatedBy = ps.UpdatedBy;
                    chkResult.Sunday = ps.Sunday;
                    chkResult.Monday = ps.Monday;
                    chkResult.Tuesday = ps.Tuesday;
                    chkResult.Wednesday = ps.Wednesday;
                    chkResult.Thursday = ps.Thursday;
                    chkResult.Friday = ps.Friday;
                    chkResult.Saturday = ps.Saturday;
                    chkResult.IsDeleted = false;
                    chkResult.SpecialityId = ps.SpecialityId;
                    var allExisitingProvidingSheduleByAppType = chkResult.ProviderScheduleByAppTypes.Where(x => x.IsDeleted == false).ToList();
                    if (allExisitingProvidingSheduleByAppType != null && allExisitingProvidingSheduleByAppType.Count > 0)
                    {

                        foreach (var item in allExisitingProvidingSheduleByAppType)
                        {
                            if (ps.providerScheduleByAppType != null && ps.providerScheduleByAppType.Count > 0)
                            {
                                var chkCurrentProvidingSheduleByAppType = ps.providerScheduleByAppType.SingleOrDefault(x => x.Id.Equals(item.Id));
                                if (chkCurrentProvidingSheduleByAppType == null)
                                {
                                    item.IsDeleted = true;

                                    _context.Entry(item).State = EntityState.Modified;
                                }
                            }
                            else
                            {
                                item.IsDeleted = true;
                                _context.Entry(item).State = EntityState.Modified;
                            }

                        }
                    }
                    if (ps.providerScheduleByAppType != null && ps.providerScheduleByAppType.Count > 0)
                    {
                        foreach (var item in ps.providerScheduleByAppType)
                        {
                            var exisitingProvidingSheduleByAppType = chkResult.ProviderScheduleByAppTypes.SingleOrDefault(x => x.Id.Equals(item.Id) && x.IsDeleted == false && x.CptgroupId.Equals(item.CPTGroupId) && x.AppTypeId.Equals(item.AppTypeId) && x.Duration.Equals(item.Duration) && x.Psid.Equals(item.PSID));

                            if (exisitingProvidingSheduleByAppType != null)
                            {
                                exisitingProvidingSheduleByAppType.IsDeleted = item.IsDeleted;
                                exisitingProvidingSheduleByAppType.AppTypeId = (int?)item.AppTypeId;
                                exisitingProvidingSheduleByAppType.CptgroupId = item.CPTGroupId;
                                exisitingProvidingSheduleByAppType.Duration = item.Duration;
                                _context.Entry(exisitingProvidingSheduleByAppType).State = EntityState.Modified;
                            }
                            else
                            {

                                Core.Entities.ProviderScheduleByAppType psa = new Core.Entities.ProviderScheduleByAppType()
                                {
                                    IsDeleted = false,
                                    AppTypeId = (int?)item.AppTypeId,
                                    CptgroupId = item.CPTGroupId,
                                    Duration = item.Duration,
                                };
                                chkResult.ProviderScheduleByAppTypes.Add(psa);
                            }
                        }
                    }
                    _context.ProviderSchedules.Update(chkResult);
                    await _context.SaveChangesAsync();
                    return true;
                }
                return false;
                //DataTable ProviderScheduleByAppTypeDT = ConversionHelper.ToDataTable(ps.providerScheduleByAppType);


                //DynamicParameters parameters = new DynamicParameters();

                //parameters.Add("@PSId", ps.PSId, DbType.Int64);
                //parameters.Add("@ProviderId", ps.ProviderId, DbType.Int64);
                //parameters.Add("@SiteId", ps.SiteId, DbType.Int32);
                //parameters.Add("@UsageId", ps.UsageId, DbType.Int32);
                //parameters.Add("@StartTime", ps.StartTime, DbType.String);//mr1 mrs 0 
                //parameters.Add("@EndTime", ps.EndTime, DbType.String);//0
                //parameters.Add("@StartDate", ps.StartDate, DbType.DateTime);
                //parameters.Add("@EndDate", ps.EndDate, DbType.DateTime);
                //parameters.Add("@BreakStartTime", ps.BreakStartTime, DbType.String);
                //parameters.Add("@BreakEndTime", ps.BreakEndTime, DbType.String);
                //parameters.Add("@BreakReason", ps.BreakReason, DbType.String);
                //parameters.Add("@AppPerHour", ps.AppPerHour, DbType.Int16);
                //parameters.Add("@MaxOverloadApps", ps.MaxOverloadApps, DbType.Int16);//contact
                //parameters.Add("@Priority", ps.Priority, DbType.Int32);
                //parameters.Add("@Active", ps.Active, DbType.Boolean);
                //parameters.Add("@UpdatedBy", ps.UpdatedBy, DbType.String);
                //parameters.Add("@Sunday", ps.Sunday, DbType.Boolean);
                //parameters.Add("@Monday", ps.Monday, DbType.Boolean);
                //parameters.Add("@Tuesday", ps.Tuesday, DbType.Boolean);
                //parameters.Add("@Wednesday", ps.Wednesday, DbType.Boolean);
                //parameters.Add("@Thursday", ps.Thursday, DbType.Boolean);
                //parameters.Add("@Friday", ps.Friday, DbType.Boolean);
                //parameters.Add("@Saturday", ps.Saturday, DbType.Boolean);
                //parameters.Add("@ProviderScheduleByAppTypeVar", ProviderScheduleByAppTypeDT, DbType.Object);

                //bool res = await DapperHelper.ExcecuteSPByParams("CP_ProviderScheduleUpdate", parameters);

                //return res;
            }
            catch (Exception ex)
            {
                return false;
            }

        }

        public async Task<bool> DeleteProviderSchedule(long PSId)
        {
            var chkResult = await Task.Run(() => _context.ProviderSchedules.Include(c => c.ProviderScheduleByAppTypes).Where(x => x.Psid == PSId && x.IsDeleted == false).FirstOrDefaultAsync());
            if (chkResult != null && chkResult.Psid > 0)
            {
                chkResult.IsDeleted = true;
                var allExisitingProvidingSheduleByAppType = chkResult.ProviderScheduleByAppTypes.ToList();
                foreach (var item in allExisitingProvidingSheduleByAppType)
                {
                    item.IsDeleted = true;
                    _context.Entry(item).State = EntityState.Modified;
                }
                _context.ProviderSchedules.Update(chkResult);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
            //DynamicParameters param = new DynamicParameters();

            //try
            //{
            //    param.Add("@PSId", PSId, DbType.Int64);



            //    bool result = await DapperHelper.ExcecuteSPByParams("CP_ProviderScheduleDelete", param);

            //    return result;
            //}
            //catch (Exception ex)
            //{

            //    return false;
            //}
        }
        public async Task<bool> UpdatePriority(List<PrioritySet> prioritySet)
        {
           
           
            try
            {
                foreach (var item in prioritySet)
                {
                    var chkRecord = await Task.Run(() => _context.ProviderSchedules.Where(x => x.Psid.Equals(item.PSId) && x.IsDeleted == false && x.ProviderId.Equals(item.ProviderId)).FirstOrDefaultAsync());
                    if(chkRecord != null)
                    {
                        chkRecord.Priority = item.Priority;
                        _context.Entry(chkRecord).State = EntityState.Modified;
                        _context.ProviderSchedules.Update(chkRecord);
                       
                    }
                    //param.Add("@PSId", item.PSId, DbType.Int64);
                    //param.Add("@ProviderId", item.ProviderId, DbType.Int64);
                    //param.Add("@Priority", item.Priority, DbType.Int32);
                    //bool res = await DapperHelper.ExcecuteSPByParams("CP_PriorityUpdate", param);
                }
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {

                return false;
            }
            //DynamicParameters param = new DynamicParameters();
        }



        public async Task<object> GetDurationOfTimeSlot(int SiteId, int ProviderId, int FacilityId, string Days)
        {

            try
            {

                var Data = await System.Threading.Tasks.Task.Run(() => _context.VwGetDurationTimeSlots.Where(x => x.FacilityId == FacilityId && x.SiteId == SiteId && x.ProviderId == ProviderId && x.IsDeleted==false).ToList());
                switch (Days)
                {
                    case "Monday":
                        Data = Data.Where(x => x.Monday == true).ToList();
                        break;
                    case "Tuesday":
                        Data = Data.Where(x => x.Tuesday == true).ToList();
                        break;
                    case "Wednesday":
                        Data = Data.Where(x => x.Wednesday == true).ToList();
                        break;
                    case "Thursday":
                        Data = Data.Where(x => x.Thursday == true).ToList();
                        break;
                    case "Friday":
                        Data = Data.Where(x => x.Friday == true).ToList();
                        break;
                    case "Saturday":
                        Data = Data.Where(x => x.Saturday == true).ToList();
                        break;
                    case "Sunday":
                        Data = Data.Where(x => x.Sunday == true).ToList();
                        break;
                    default:
                        break;
                }
                var res = Data.FirstOrDefault();
                return res;

            }
            catch (Exception ex)
            {

                return ex.Message;
            }
            //DynamicParameters param = new DynamicParameters();
        }
    }
}

