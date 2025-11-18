using Dapper;
using HMIS.Infrastructure.ORM;
using HMIS.Infrastructure.Repositories;
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
using HMIS.Application.DTOs.Registration;
using HMIS.Application.DTOs.AppointmentDTOs;
using SchAppointment = HMIS.Application.DTOs.AppointmentDTOs.SchAppointmentModel;
using HMIS.Application.DTOs.Clinical;
using System.Globalization;
using System.Linq.Dynamic.Core;
using HMIS.Application.DTOs.AuthenticateDTOs;
using System.Linq;
using System.Numerics;
using static HMIS.Application.DTOs.AppointmentDTOs.SpLocalModel.SchAppointmentIWithFilter;
using Microsoft.SqlServer.Management.Smo;
using HMIS.Core.Context;

namespace HMIS.Application.ServiceLogics
{
    public class AppointmentManager : IAppointmentManager
    {
        private readonly HMISDbContext _context;
        private readonly IUnitOfWork _unitOfWork;
        public IConfiguration Configuration { get; }

        public AppointmentManager(HMISDbContext context, IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _context = context;
            _unitOfWork = unitOfWork;
            Configuration = configuration;
        }

        public async Task<DataSet> SearchAppointmentDB(
             DateTime? FromDate,
             DateTime? ToDate,
             int? ProviderID,
             int? LocationID,
             int? SpecialityID,
             int? SiteID,
             int? FacilityID,
             int? ReferredProviderId,
             long? PurposeOfVisitId,
             int? AppTypeId,
             int? VisitTypeId,
             string? LastUpdatedBy,
             //[FromQuery(Name = "ids")] 
             [FromQuery] List<int>? AppStatusIds,
             bool? ShowScheduledAppointmentOnly,
             int? Page, int? Size)
        {
            try
            {
                // ✅ Handle Null/Numeric Params (default = -1)
                ProviderID ??= -1;
                LocationID ??= -1;
                SpecialityID ??= -1;
                SiteID ??= -1;
                FacilityID ??= -1;
                ReferredProviderId ??= -1;
                PurposeOfVisitId ??= -1;
                AppTypeId ??= -1;
                VisitTypeId ??= -1;

                // ✅ Handle Paging
                Page ??= 1;
                Size ??= 10;

                // ✅ Convert Status IDs to comma separated string
                string? statusIdsCsv = (AppStatusIds != null && AppStatusIds.Any())
                    ? string.Join(",", AppStatusIds)
                    : null;

                DynamicParameters param = new DynamicParameters();

                string FROMD = FromDate?.ToString("yyyy-MM-dd");
                
                DateTime CFROMD = Convert.ToDateTime(FROMD);

                // ✅ Date Handling
                if (FromDate == DateTime.MinValue || FromDate == null)
                    param.Add("@FromDate", DBNull.Value, DbType.DateTime);
                else
                    param.Add("@FromDate", FromDate, DbType.DateTime);

                if (ToDate == DateTime.MinValue || ToDate == null)

                    param.Add("@ToDate", DBNull.Value, DbType.DateTime);
                else
                ToDate = ToDate.Value.Date.AddDays(1).AddSeconds(-1); // 23:59:59
                param.Add("@ToDate", ToDate, DbType.DateTime);

                // ✅ Normal Params
                param.Add("@ProviderId", ProviderID, DbType.Int64);
                param.Add("@LocationId", LocationID, DbType.Int64);
                param.Add("@SpecialityId", SpecialityID, DbType.Int64);
                param.Add("@SiteId", SiteID, DbType.Int64);
                param.Add("@FacilityID", FacilityID, DbType.Int64);
                param.Add("@ReferredProviderId", ReferredProviderId, DbType.Int64);
                param.Add("@PurposeOfVisitId", PurposeOfVisitId, DbType.Int64);
                param.Add("@AppTypeId", AppTypeId, DbType.Int64);
                param.Add("@VisitTypeId", VisitTypeId, DbType.Int64);
                param.Add("@LastUpdatedBy", LastUpdatedBy, DbType.String);

                // ✅ New Params (IDs as string & ShowScheduled flag)
                param.Add("@AppStatusIds", statusIdsCsv, DbType.String);
                param.Add("@ShowScheduledAppointmentOnly", ShowScheduledAppointmentOnly ?? false, DbType.Boolean);

                // ✅ Paging
                param.Add("@PagingSize", Size, DbType.Int32);
                param.Add("@OffsetValue", (Page - 1) * Size, DbType.Int32);

                // ✅ Call SP
                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("SchAppointmentsLoad", param);

                if (ds.Tables[0].Rows.Count == 0)
                    throw new Exception("No data found");

                return ds;
            }
            catch (Exception)
            {
                return new DataSet();
            }
        }


        public async Task<DataSet> GetAppointmentDetailsDB(long VisitAccountNo)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@VisitAccountNo", VisitAccountNo, DbType.Int64);


                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("PatientVisitStatusGet", param);
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

        public async Task<DataSet> GetViewAppointmentDetailsDB(ViewAppointments view)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@ProviderId", view.ProviderId);
                param.Add("@AppDate", view.AppDate, DbType.DateTime);
                param.Add("@SiteId", view.SiteId);
                param.Add("@LocationId", view.LocationId);
                param.Add("@FacilityId", view.FacilityId);
                param.Add("@SpecialtyId", view.SpecialtyId);



                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("SchAppointmentGetViewApp", param);
                if (ds.Tables.Count == 0)
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

        public async Task<bool> InsertAppointmentDB(SchAppointment schApp)
        {
            using (var transaction = _unitOfWork.BeginTransaction())
            {

                try
                {

                    long? getPlanId = null;
                    var getpurposeofvisit = _context.ProblemList.Where(x => x.ProblemId == schApp.PurposeOfVisitId).FirstOrDefault().ProblemName;
                    var EmployeeId = _context.Hremployee.Where(x => x.EmployeeId == schApp.EmployeeId).FirstOrDefault();
                    if (schApp.PlanId != null)
                    {
                        getPlanId = _context.BlpayerPlan.Where(x => x.PlanId == schApp.PlanId.ToString()).FirstOrDefault().Id;
                    }

                    Core.Entities.SchAppointment schAppointment = new Core.Entities.SchAppointment();

                    schAppointment.ProviderId = schApp.ProviderId;
                    schAppointment.Mrno = schApp.MRNo;
                    schAppointment.VisitTypeId = schApp.VisitTypeId;
                    schAppointment.AppId = (long)schApp.AppId;
                    //schAppointment.AppDateTime = schApp.AppDateTime; // Convert.ToDateTime(schApp.date + " " + schApp.time);  
                    string dateTimeString = schApp.date + " " + schApp.time;
                    schAppointment.AppDateTime = DateTime.ParseExact(
                        dateTimeString,
                        "yyyy-MM-dd hh:mm tt",
                        CultureInfo.InvariantCulture
                    );
                    schAppointment.Duration = schApp.Duration;
                    schAppointment.AppNote = schApp.AppNote;
                    schAppointment.SiteId = schApp.SiteId;
                    schAppointment.FacilityId = schApp.FacilityId;
                    schAppointment.LocationId = schApp.LocationId;
                    schAppointment.AppTypeId = schApp.AppTypeId;
                    schAppointment.AppCriteriaId = schApp.AppCriteriaId;
                    schAppointment.AppStatusId = schApp.AppStatusId;
                    schAppointment.PatientStatusId = schApp.PatientStatusId;
                    schAppointment.ReferredProviderId = schApp.ReferredProviderId;
                    schAppointment.IsPatientNotified = schApp.IsPatientNotified;
                    schAppointment.IsActive = schApp.IsActive;
                    schAppointment.EnteredBy = schApp.EnteredBy;
                    schAppointment.EntryDateTime = schApp.EntryDateTime;
                    schAppointment.DateTimeNotYetArrived = schApp.DateTimeNotYetArrived;
                    schAppointment.DateTimeCheckIn = schApp.DateTimeCheckIn;
                    schAppointment.DateTimeReady = schApp.DateTimeReady;
                    schAppointment.DateTimeSeen = schApp.DateTimeSeen;
                    schAppointment.DateTimeBilled = schApp.DateTimeBilled;
                    schAppointment.DateTimeCheckOut = schApp.DateTimeCheckOut;
                    schAppointment.UserNotYetArrived = schApp.UserNotYetArrived;
                    schAppointment.UserCheckIn = schApp.UserCheckIn;
                    schAppointment.UserReady = schApp.UserReady;
                    schAppointment.UserSeen = schApp.UserSeen;
                    schAppointment.UserBilled = schApp.UserBilled;
                    schAppointment.UserCheckOut = schApp.UserCheckOut;
                    schAppointment.PurposeOfVisitId = schApp.PurposeOfVisitId;
                    schAppointment.PurposeOfVisit = getpurposeofvisit;
                    schAppointment.PatientNotifiedId = schApp.PatientNotifiedId;
                    schAppointment.RescheduledId = schApp.RescheduledID;
                    schAppointment.ByProvider = schApp.ByProvider;
                    schAppointment.SpecialtyId = schApp.SpecialtyID;
                    schAppointment.IsDeleted = false;
                    schAppointment.Anesthesiologist = schApp.Anesthesiologist;
                    schAppointment.CptgroupId = schApp.CPTGroupId;
                    schAppointment.AppointmentClassification = schApp.AppointmentClassification;
                    schAppointment.TelemedicineUrl = schApp.TelemedicineURL;
                    schAppointment.PatientBalance = schApp.PatientBalance;
                    schAppointment.PlanBalance = schApp.PlanBalance;
                    schAppointment.PlanCopay = schApp.PlanCopay;
                    schAppointment.EmployeeId = schApp.EmployeeId;
                    schAppointment.PlanId = getPlanId;
                    schAppointment.PatientId = schApp.PatientId;
                    schAppointment.PayerId = schApp.PayerId;
                    schAppointment.AppDate = schApp.AppDateTime;
                    schAppointment.IsConsultationVisit = schApp.IsConsultationVisit;

                    //    DateTime.ParseExact(
                    //    "yyyy-MM-dd hh:mm:ss tt",
                    //    CultureInfo.InvariantCulture
                    //);




                    string visitAcc = "";
                    string visitAccCode = "";
                    var chkAppointmentCount = await Task.Run(() => _context.SchAppointment.Where(x => x.Mrno == schApp.MRNo && x.AppDateTime.Date.ToString() == schApp.date && x.IsDeleted == false).Count());
                    if (schApp.VisitTypeId == 2)
                    {
                        visitAccCode = "IP";
                    }
                    else if (schApp.VisitTypeId == 1)
                    {
                        visitAccCode = "OP";
                    }
                    else
                    {
                        visitAccCode = "OP";
                        schApp.VisitTypeId = 1;
                    }
                    if (chkAppointmentCount == 1 || chkAppointmentCount == 0)
                    {
                        visitAcc = visitAccCode + schApp.MRNo + schAppointment.AppDateTime.ToString("yyMMdd") + 1;
                    }
                    else
                    {
                        chkAppointmentCount = chkAppointmentCount + 1;
                        visitAcc = visitAccCode + schApp.MRNo + schAppointment.AppDateTime.ToString("yyMMdd") + chkAppointmentCount;
                    }

                    schAppointment.VisitAccDisplay = visitAcc;


                    schAppointment.IsDeleted = false;



                    //Core.Entities.BlpatientVisit blpatientVisit = new BlpatientVisit()
                    //{
                    //    VisitAccDisplay = null,
                    //    Copay = (decimal)0.00,
                    //    LastUpdatedDate = DateTime.UtcNow,
                    //    LastUpdatedBy = schApp.EnteredBy,
                    //    ChargeCaptureComments = null,
                    //    IsSelfPay = true,
                    //    IsPatientResponsible = null,
                    //    EncounterId = null,
                    //    IsPatientResponsibleDate = null,
                    //    IsSelfPayDate = null,
                    //    ProvRemId = null,
                    //    VisitTypeId = 1,
                    //    IsInvoiceGenerated = false,
                    //    InvoiceNo = null,
                    //    SubCaseNo = null,
                    //    SpecialDiscount = (decimal?)0.00,
                    //    IsPrinted = null,
                    //    IsSave = null,
                    //    PayerId = null,
                    //    SubscriberId = null,
                    //    MergedStatus = null,
                    //    SpecialDiscountAmount = (decimal?)0.00,
                    //    DiscountType = null,
                    //    DiscountAuthorizeBy = null,
                    //    CodingFinalized = null,
                    //    CodingFinalizedBy = null,
                    //    CodingFinalizedDate = null,
                    //    Discount = null,
                    //    Reason = null,
                    //    CodingReviewed = null,
                    //    CodingReviewedBy = null,
                    //    CodingReviewedDate = null,
                    //    CodingReviewedRemarks = null,
                    //    NonBillable = null,
                    //    InvoiceGeneratedById = null,
                    //    RegisteredToHie = null,
                    //    IsConsultationVisit = null,
                    //    Labrefno = null,
                    //    RefFacilityMrn = null,
                    //    RefFacilityEncounterId = null,
                    //    EligibilityId = null,
                    //    ElrequestStatusId = null,
                    //    ElstatusId = null,
                    //    EligibilityNo = null,
                    //    IsDeleted = false,

                    //};
                    //schAppointment.BlpatientVisit.Add(blpatientVisit);
                    //Core.Entities.PatientVisitStatus patientVisitStatus = new PatientVisitStatus()
                    //{
                    //    TimeIn = DateTime.UtcNow,
                    //    TimeOut = null,
                    //    AttendingResourceId = schApp.ProviderId,
                    //    LocationId = null,
                    //    StatusId = 1,
                    //    VisitStatusId = null,
                    //    IsDeleted = false,
                    //};
                    //blpatientVisit.PatientVisitStatuses.Add(patientVisitStatus);
                    var result = await _context.SchAppointment.AddAsync(schAppointment);
                    //this.AddBLPatientVisit();

                    await _context.SaveChangesAsync();
                    transaction.Commit();
                    return true;
                    //DynamicParameters parameters = new DynamicParameters();

                    //parameters.Add("VisitTypeId ", schApp.VisitTypeId, DbType.Int32);

                    //parameters.Add("AppId", schApp.AppId, DbType.Int64);


                    //parameters.Add("ProviderId", schApp.ProviderId, DbType.Int64);
                    //parameters.Add("MRNo", schApp.MRNo, DbType.String);
                    //parameters.Add("AppDateTime", schApp.AppDateTime, DbType.DateTime);
                    //parameters.Add("Duration", schApp.Duration, DbType.Int32);
                    //parameters.Add("AppNote", schApp.AppNote, DbType.String);
                    //parameters.Add("SiteId", schApp.SiteId, DbType.Int32);
                    //parameters.Add("FacilityId", schApp.FacilityId, DbType.Int32);
                    //parameters.Add("LocationId", schApp.LocationId, DbType.Int32);
                    //parameters.Add("AppTypeId", schApp.AppTypeId, DbType.Int32);
                    //parameters.Add("AppCriteriaId", schApp.AppCriteriaId, DbType.Int32);
                    //parameters.Add("AppStatusId", schApp.AppStatusId, DbType.Int32);
                    //parameters.Add("PatientStatusId", schApp.PatientStatusId, DbType.Int32);
                    //parameters.Add("ReferredProviderId", schApp.ReferredProviderId, DbType.Int64);
                    //parameters.Add("IsPatientNotified", schApp.IsPatientNotified, DbType.Boolean);
                    //parameters.Add("IsActive", schApp.IsActive, DbType.Boolean);
                    //parameters.Add("EnteredBy", schApp.EnteredBy, DbType.String);
                    //parameters.Add("EntryDateTime", schApp.EntryDateTime, DbType.DateTime);
                    //parameters.Add("DateTimeNotYetArrived", schApp.DateTimeNotYetArrived, DbType.DateTime);
                    //parameters.Add("DateTimeCheckIn", schApp.DateTimeCheckIn, DbType.DateTime);
                    //parameters.Add("DateTimeReady", schApp.DateTimeReady, DbType.DateTime);
                    //parameters.Add("DateTimeSeen", schApp.DateTimeSeen, DbType.DateTime);
                    //parameters.Add("DateTimeBilled", schApp.DateTimeBilled, DbType.DateTime);
                    //parameters.Add("DateTimeCheckOut", schApp.DateTimeCheckOut, DbType.DateTime);
                    //parameters.Add("UserNotYetArrived", schApp.UserNotYetArrived, DbType.String);
                    //parameters.Add("UserCheckIn", schApp.UserCheckIn, DbType.String);
                    //parameters.Add("UserReady", schApp.UserReady, DbType.String);
                    //parameters.Add("UserSeen", schApp.UserSeen, DbType.String);
                    //parameters.Add("UserBilled", schApp.UserBilled, DbType.String);
                    //parameters.Add("UserCheckOut", schApp.UserCheckOut, DbType.String);
                    //parameters.Add("PurposeOfVisit", schApp.PurposeOfVisit, DbType.String);
                    //parameters.Add("UpdateServerTime", schApp.UpdateServerTime, DbType.Boolean);
                    //parameters.Add("PatientNotifiedID", schApp.PatientNotifiedID, DbType.Int32);
                    //parameters.Add("RescheduledID", schApp.RescheduledID, DbType.Int32);
                    //parameters.Add("ByProvider", schApp.ByProvider, DbType.Boolean);
                    //parameters.Add("SpecialtyID", schApp.SpecialtyID, DbType.Int32);
                    //parameters.Add("VisitStatusEnabled", schApp.VisitStatusEnabled, DbType.Boolean);
                    //parameters.Add("Anesthesiologist", schApp.Anesthesiologist, DbType.Int64);
                    //parameters.Add("CPTGroupId", schApp.CPTGroupId, DbType.Int64);
                    //parameters.Add("AppointmentClassification", schApp.AppointmentClassification, DbType.Int32);
                    //parameters.Add("OrderReferralId", schApp.OrderReferralId, DbType.Int64);
                    //parameters.Add("TelemedicineURL", schApp.TelemedicineURL, DbType.String);


                    //bool res = await DapperHelper.ExcecuteSPByParams("[SchAppointmentInsert]", parameters);

                    //if (res)
                    //{
                    //    return res;
                    //}
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return false;
                }

            }
        }

        public async Task<bool> UpdateAppointmentDB(SchAppointment schApp)
        {

            try
            {
                string planId = "";
                if (schApp.PlanId==null) 
                {
                    planId = "0";
                } else
                {
                    planId = Convert.ToString(schApp.PlanId);
                }
                    var getPlanId = _context.BlpayerPlan.Where(x => x.PlanId == planId).FirstOrDefault().Id;
                long? pId = null;
                if (getPlanId == null)
                {
                    pId = null;
                }
                else
                {
                    pId = getPlanId;
                }
                DateTime Dt = Convert.ToDateTime(schApp.date).Date;
                string Date = Dt.ToShortDateString();
                var chkResult = await Task.Run(() => _context.SchAppointment.Where(x => x.AppId.Equals(schApp.AppId) && x.IsDeleted == false).FirstOrDefaultAsync());
                var EmployeeId = _context.Hremployee.Where(x => x.EmployeeId == schApp.EmployeeId).FirstOrDefault();
                if (chkResult != null && chkResult.AppId > 0)
                {
                    //chkResult.AppId = schApp.AppId;
                    chkResult.ProviderId = schApp.ProviderId;
                    //chkResult.Mrno = schApp.MRNo;
                    //chkResult.VisitTypeId = schApp.VisitTypeId;
                    chkResult.AppId = (long)schApp.AppId;
                    //string dateString = Date + schApp.time;
                    //DateTime parsedDateTime = DateTime.ParseExact(dateString, "M/d/yyyyh:mm:ss tt", CultureInfo.InvariantCulture);
                    //chkResult.AppDateTime = parsedDateTime; //schApp.AppDateTime;

                    string dateTimeString = schApp.date + " " + schApp.time;
                    chkResult.AppDateTime = DateTime.ParseExact(
                        dateTimeString,
                        "yyyy-MM-dd hh:mm tt",
                        CultureInfo.InvariantCulture
                    );
                    chkResult.AppDate = schApp.AppDateTime;
                    chkResult.Duration = schApp.Duration;
                    chkResult.AppNote = schApp.AppNote;
                    chkResult.SiteId = schApp.SiteId;
                    chkResult.FacilityId = schApp.FacilityId;
                    chkResult.LocationId = schApp.LocationId;
                    chkResult.AppTypeId = schApp.AppTypeId;
                    chkResult.AppCriteriaId = schApp.AppCriteriaId;
                    chkResult.AppStatusId = schApp.AppStatusId;
                    chkResult.PatientStatusId = schApp.PatientStatusId;
                    chkResult.ReferredProviderId = schApp.ReferredProviderId;
                    chkResult.IsPatientNotified = schApp.IsPatientNotified;
                    chkResult.IsActive = schApp.IsActive;
                    chkResult.EnteredBy = schApp.EnteredBy;
                    chkResult.EntryDateTime = schApp.EntryDateTime;
                    chkResult.DateTimeNotYetArrived = schApp.DateTimeNotYetArrived;
                    chkResult.DateTimeCheckIn = schApp.DateTimeCheckIn;
                    chkResult.DateTimeReady = schApp.DateTimeReady;
                    chkResult.DateTimeSeen = schApp.DateTimeSeen;
                    chkResult.DateTimeBilled = schApp.DateTimeBilled;
                    chkResult.DateTimeCheckOut = schApp.DateTimeCheckOut;
                    chkResult.UserNotYetArrived = schApp.UserNotYetArrived;
                    chkResult.UserCheckIn = schApp.UserCheckIn;
                    chkResult.UserReady = schApp.UserReady;
                    chkResult.UserSeen = schApp.UserSeen;
                    chkResult.UserBilled = schApp.UserBilled;
                    chkResult.UserCheckOut = schApp.UserCheckOut;
                    chkResult.PurposeOfVisitId = schApp.PurposeOfVisitId;
                    //chkResult.UpdateServerTime = schApp.UpdateServerTime;
                    chkResult.PatientNotifiedId = schApp.PatientNotifiedId;
                    chkResult.RescheduledId = schApp.RescheduledID;
                    chkResult.ByProvider = schApp.ByProvider;
                    chkResult.SpecialtyId = schApp.SpecialtyID;
                    chkResult.IsDeleted = false;
                    chkResult.Anesthesiologist = schApp.Anesthesiologist;
                    chkResult.CptgroupId = schApp.CPTGroupId;
                    chkResult.AppointmentClassification = schApp.AppointmentClassification;
                    chkResult.PatientBalance = schApp.PatientBalance;
                    chkResult.PlanBalance = schApp.PlanBalance;
                    chkResult.PlanCopay = schApp.PlanCopay;
                    chkResult.TelemedicineUrl = schApp.TelemedicineURL;
                    chkResult.EmployeeId = EmployeeId.EmployeeId;
                    chkResult.PlanId = pId;
                    chkResult.PatientId = schApp.PatientId;
                    chkResult.IsConsultationVisit = schApp.IsConsultationVisit;
                    chkResult.PayerId = schApp.PayerId;
                    _context.SchAppointment.Update(chkResult);
                    await _context.SaveChangesAsync();
                    return true;
                }
           
                //DynamicParameters parameters = new DynamicParameters();
                //parameters.Add("AppId", schApp.AppId, DbType.Int64);
                //parameters.Add("ProviderId", schApp.ProviderId, DbType.Int64);
                //parameters.Add("MRNo", schApp.MRNo, DbType.String);
                //parameters.Add("AppDateTime", schApp.AppDateTime, DbType.DateTime);
                //parameters.Add("Duration", schApp.Duration, DbType.Int32);
                //parameters.Add("AppNote", schApp.AppNote, DbType.String);
                //parameters.Add("SiteId", schApp.SiteId, DbType.Int32);
                //parameters.Add("LocationId", schApp.LocationId, DbType.Int32);
                //parameters.Add("AppTypeId", schApp.AppTypeId, DbType.Int32);
                //parameters.Add("AppCriteriaId", schApp.AppCriteriaId, DbType.Int32);
                //parameters.Add("AppStatusId", schApp.AppStatusId, DbType.Int32);
                //parameters.Add("PatientStatusId", schApp.PatientStatusId, DbType.Int32);
                //parameters.Add("ReferredProviderId", schApp.ReferredProviderId, DbType.Int64);
                //parameters.Add("IsPatientNotified", schApp.IsPatientNotified, DbType.Boolean);
                //parameters.Add("IsActive", schApp.IsActive, DbType.Boolean);
                //parameters.Add("EnteredBy", schApp.EnteredBy, DbType.String);
                //parameters.Add("EntryDateTime", schApp.EntryDateTime, DbType.DateTime);
                //parameters.Add("DateTimeNotYetArrived", schApp.DateTimeNotYetArrived, DbType.DateTime);
                //parameters.Add("DateTimeCheckIn", schApp.DateTimeCheckIn, DbType.DateTime);
                //parameters.Add("DateTimeReady", schApp.DateTimeReady, DbType.DateTime);
                //parameters.Add("DateTimeSeen", schApp.DateTimeSeen, DbType.DateTime);
                //parameters.Add("DateTimeBilled", schApp.DateTimeBilled, DbType.DateTime);
                //parameters.Add("DateTimeCheckOut", schApp.DateTimeCheckOut, DbType.DateTime);
                //parameters.Add("UserNotYetArrived", schApp.UserNotYetArrived, DbType.String);
                //parameters.Add("UserCheckIn", schApp.UserCheckIn, DbType.String);
                //parameters.Add("UserReady", schApp.UserReady, DbType.String);
                //parameters.Add("UserSeen", schApp.UserSeen, DbType.String);
                //parameters.Add("UserBilled", schApp.UserBilled, DbType.String);
                //parameters.Add("UserCheckOut", schApp.UserCheckOut, DbType.String);
                //parameters.Add("PurposeOfVisit", schApp.PurposeOfVisit, DbType.String);
                //parameters.Add("UpdateServerTime", schApp.UpdateServerTime, DbType.Boolean);
                //parameters.Add("PatientNotifiedID", schApp.PatientNotifiedID, DbType.Int32);
                //parameters.Add("RescheduledID", schApp.RescheduledID, DbType.Int32);
                //parameters.Add("ByProvider", schApp.ByProvider, DbType.Boolean);
                //parameters.Add("SpecialtyID", schApp.SpecialtyID, DbType.Int32);
                //parameters.Add("CPTGroupId", schApp.CPTGroupId, DbType.Int64);
                //parameters.Add("TelemedicineURL", schApp.TelemedicineURL, DbType.String);

                //bool res = await DapperHelper.ExcecuteSPByParams("SchAppointmentUpdate", parameters);

                //if (res == true)
                //{
                //    return true;
                //}

                return false;
            }
            catch (Exception ex)
            {
                return false;
            }




        }



        public async Task<DataSet> SearchAppointmentHistoryDB(string MRNo, int? ProviderId, int? PatientStatusId, int? AppStatusId, int? Page, int? Size)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@MRNo", MRNo, DbType.String);
                param.Add("@ProviderId", ProviderId, DbType.Int64);
                param.Add("@PatientStatusId", PatientStatusId, DbType.Int64);
                param.Add("@AppStatusId", AppStatusId, DbType.Int64);
                param.Add("@Page", Page, DbType.Int64);
                param.Add("@Size", Size, DbType.Int64);


                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("[SchAppointmentHistoryMain]", param);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return null;
                }

                return ds;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }

        }

        public async Task<bool> CancelOrRescheduleAppointmentDB(long AppId, int AppStatusId, bool ByProvider, int? RescheduledId)
        {
            try
            {
                var chkResult = await Task.Run(() => _context.SchAppointment.Where(x => x.AppId.Equals(AppId) && x.IsDeleted == false).FirstOrDefaultAsync());
                if (chkResult != null && chkResult.AppId > 0)
                {
                    chkResult.AppStatusId = AppStatusId;
                    chkResult.AppId = AppId;
                    chkResult.IsDeleted = false;
                    chkResult.ByProvider = ByProvider;
                    chkResult.RescheduledId = RescheduledId;

                    //await _context.SchAppointments.AddAsync(chkResult);
                     _context.SchAppointment.Update(chkResult);
                    await _context.SaveChangesAsync();
                    return true;
                }
                //    DynamicParameters param = new DynamicParameters();
                //param.Add("@AppId", AppId, DbType.Int64);
                //param.Add("@AppStatusId", AppStatusId, DbType.Int64);
                //param.Add("@ByProvider", ByProvider, DbType.Boolean);
                //param.Add("@RescheduledId", RescheduledId, DbType.Int64);



                ////  DataSet ds = await DapperHelper.GetDataSetBySPWithParams("[SchAppointmentUpdateAppStatus]", param);
                //bool res = await DapperHelper.ExcecuteSPByParams("SchAppointmentUpdateAppStatus", param);

                //if (res == true)
                //{
                //    return true;
                //}

                return false;
            }
            catch (Exception ex)
            {
                return false;
            }


        }

        //public async Task<bool> AppointmentStatus(long appId, int patientStatusId, int appVisitId)
        //{
        //    try
        //    {
        //        var chkResult = await Task.Run(() => _context.SchAppointments.Where(x => x.AppId.Equals(appId) && x.IsDeleted == false).FirstOrDefaultAsync());
        //        if (chkResult != null && chkResult.AppId > 0)
        //        {
        //            chkResult.PatientStatusId = patientStatusId;
        //            chkResult.AppId = appId;
        //            chkResult.IsDeleted = false;
        //            if (patientStatusId == 3)
        //            {
        //                chkResult.VisitStatusId = appVisitId;
        //            }
        //            else
        //            {
        //                chkResult.VisitStatusId = null;
        //            }
        //            var chkChildResult = await Task.Run(() => _context.BlpatientVisits.Where(x => x.AppointmentId.Equals(chkResult.AppId) && x.IsDeleted == false).FirstOrDefaultAsync());
        //            if (chkChildResult != null && chkChildResult.VisitAccountNo > 0)
        //            {
        //                //Core.Entities.PatientVisitStatus patientVisitStatus = new PatientVisitStatus()
        //                //{
        //                //    TimeIn = DateTime.UtcNow,
        //                //    TimeOut = null,
        //                //    AttendingResourceId = chkResult.ProviderId,
        //                //    LocationId = null,
        //                //    StatusId = patientStatusId,
        //                //    VisitStatusId = null,
        //                //    IsDeleted = false,
        //                //};
        //                Core.Entities.PatientVisitStatus patientVisitStatus = new Core.Entities.PatientVisitStatus();

        //                patientVisitStatus.TimeIn = DateTime.UtcNow;
        //                patientVisitStatus.TimeOut = null;
        //                patientVisitStatus.AttendingResourceId = chkResult.ProviderId;
        //                patientVisitStatus.LocationId = null;
        //                patientVisitStatus.StatusId = patientStatusId;
        //                patientVisitStatus.VisitStatusId = null;
        //                patientVisitStatus.IsDeleted = false;
        //                _context.PatientVisitStatuses.Add(patientVisitStatus);
        //            }
        //            _context.SchAppointments.Update(chkResult);
        //            await _context.SaveChangesAsync();
        //            return true;
        //        }
        //        return false;
        //    }
        //    catch (Exception ex)
        //    {

        //        return false;
        //    }
        //}


        public async Task<bool> AppointmentStatus(long appId, int patientStatusId, int appVisitId)
        {
            try
            {
                var chkResult = await Task.Run(() => _context.SchAppointment.Where(x => x.AppId.Equals(appId) && x.IsDeleted == false).FirstOrDefaultAsync());
                if (chkResult != null && chkResult.AppId > 0)
                {
                    chkResult.PatientStatusId = patientStatusId;
                    chkResult.AppId = appId;
                    chkResult.IsDeleted = false;
                    if (patientStatusId == 3)
                    {
                        chkResult.VisitStatusId = appVisitId;
                    }
                    else
                    {
                        chkResult.VisitStatusId = null;
                    }
                    //var chkChildResult = await Task.Run(() => _context.BlpatientVisits.Where(x => x.AppointmentId.Equals(chkResult.AppId) && x.IsDeleted == false).FirstOrDefaultAsync());
                    if (chkResult != null && chkResult.VisitAccountNo > 0)
                    {
                        //Core.Entities.PatientVisitStatus patientVisitStatus = new PatientVisitStatus()
                        //{
                        //    TimeIn = DateTime.UtcNow,
                        //    TimeOut = null,
                        //    AttendingResourceId = chkResult.ProviderId,
                        //    LocationId = null,
                        //    StatusId = patientStatusId,
                        //    VisitStatusId = null,
                        //    IsDeleted = false,
                        //};
                        Core.Entities.PatientVisitStatus patientVisitStatus = new Core.Entities.PatientVisitStatus();

                        patientVisitStatus.TimeIn = DateTime.UtcNow;
                        patientVisitStatus.TimeOut = null;
                        patientVisitStatus.AttendingResourceId = chkResult.ProviderId;
                        patientVisitStatus.LocationId = null;
                        patientVisitStatus.StatusId = patientStatusId;
                        patientVisitStatus.VisitStatusId = null;
                        patientVisitStatus.IsDeleted = false;
                        _context.PatientVisitStatus.Add(patientVisitStatus);
                    }
                    _context.SchAppointment.Update(chkResult);
                    await _context.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {

                return false;
            }
        }


        public async Task<DataSet> ValidateAppointmentDB(SchAppointment sa)
        {
            try
            {
                var dt = sa.date +" "+ sa.time;
                DynamicParameters param = new DynamicParameters();

                param.Add("@AppDateTime",dt, DbType.DateTime);
                param.Add("@ProviderId", sa.ProviderId, DbType.Int64);
                param.Add("@SiteId", sa.SiteId, DbType.Int32);
                param.Add("@PayerID", sa.PayerId, DbType.Int64);
                param.Add("@MRNo", sa.MRNo, DbType.String);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("SCH_ValidateAppointmentInsertion", param);
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

        public async Task<DataSet> ValidateCheckInDB(long AppId)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@AppId", AppId);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("ValidateCheckIn", param);
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

        public async Task<bool> UpdateRescheduleAppointmentDB(DTOs.AppointmentDTOs.SchRescheduleAppointments schReschedule)
        {

            try
            {
                //var chkResult = await Task.Run(() => _context.SchAppointments.Where(x => x.AppId == (schApp.AppId) && x.IsDeleted == false).FirstOrDefaultAsync());
                var chkResult = await _context.SchAppointment.Where(x => x.AppId == schReschedule.AppId && (x.IsDeleted == false)).FirstOrDefaultAsync();
                if (chkResult != null && chkResult.AppId > 0)
                {
                    chkResult.AppId = schReschedule.AppId;
                    chkResult.ProviderId = schReschedule.ProviderId;
                    chkResult.AppId = (long)schReschedule.AppId;
                    chkResult.AppDateTime = schReschedule.AppDateTime;
                    chkResult.SiteId = schReschedule.SiteId;
                    chkResult.FacilityId = schReschedule.FacilityId;
                    chkResult.LocationId = schReschedule.LocationId;
                    chkResult.AppStatusId = schReschedule.AppStatusId;
                    //chkResult.Reason = schReschedule.Reason;
                    _context.SchAppointment.Update(chkResult);
                    await _context.SaveChangesAsync();
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                return false;
            }

        }
        public async Task<DataSet> SpeechtoText(int? MRNo, int? PageNumber, int? PageSize)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();


                param.Add("@MRNo", MRNo);
                param.Add("@PageNumber", PageNumber);
                param.Add("@PageSize", PageSize);
                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("GetAllSpeechData", param);
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

        public async Task<bool> InsertSpeech(SpeechModel sp)
        {

            try
            {
                //regPatient.PatientId = (long)sp.PatientId;
                var patid = await _context.RegPatient.Where(x => x.Mrno == sp.Mrno).Select(x => x.PatientId).FirstOrDefaultAsync();
                RegPatient regPatient = new RegPatient();
                regPatient.PatientId = patid; regPatient.Mrno = sp.Mrno;
                Core.Entities.SpeechToText speech = new Core.Entities.SpeechToText()
                {
                     NoteTitle=sp.NoteTitle,
                    NoteText = sp.NoteText,
                    CreatedOn = DateTime.UtcNow,
                    Description = sp.Description,
                    CreatedBy = sp.CreatedBy,
                    SignedBy = sp.SignedBy,
                    Mrno=sp.Mrno,
                    PatientId = regPatient.PatientId,
                    UpdatedBy=sp.UpdatedBy,
                    VisitDate=sp.VisitDate,



                };
                //Problem is here
                await _context.SpeechToText.AddAsync(speech);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)
            {

                return false;
            }
            return false;
        }
 public async Task<SchAppointment> GetAppoimentForEditById ( long appId)
        {
            try
            {
                //IQueryable<SchAppointment> appointment1 = (IQueryable<SchAppointment>) await Task.Run(() => from sc in
                //_context.SchAppointments where sc.AppId == AppId select new  Service.DTOs.AppointmentDTOs.SchAppointment
                //{
                //    ProviderId=sc.ProviderId,
                //    SpecialtyID = sc.SpecialtyId,
                //    FacilityId = sc.FacilityId,
                //    SiteId = sc.SiteId,
                //    PurposeOfVisit = sc.PurposeOfVisitId,
                //    VisitTypeId = sc.VisitTypeId,
                //    AppDateTime = sc.AppDateTime,
                //    ReferredProviderId = sc.ReferredProviderId,
                //    AppTypeId = sc.AppTypeId,
                //    Duration = sc.Duration,
                //    LocationId = sc.LocationId,
                //    AppCriteriaId = sc.AppCriteriaId,
                //    PatientNotifiedId = sc.PatientNotifiedId,
                //    AppStatusId = sc.AppStatusId,
                //    PayerId = sc.PayerId,
                //    AppointmentClassification = sc.AppointmentClassification,
                //});

                IQueryable<Core.Entities.SchAppointment> appointment1 = (IQueryable<Core.Entities.SchAppointment>)_context.SchAppointment.Where(x => x.AppId == appId);

                Core.Entities.SchAppointment result = appointment1.FirstOrDefault();





                //IQueryable<Core.Entities.SchAppointment> appointment1 = (IQueryable<Core.Entities.SchAppointment>)await Task.Run(() => 
                //_context.SchAppointments.Where(x=>x.AppId==AppId));
                // Service.DTOs.AppointmentDTOs.SchAppointment result = new Service.DTOs.AppointmentDTOs.SchAppointment();
                //var result = (Core.Entities.SchAppointment)appointment1;
                SchAppointment appointment = new SchAppointment();

                if (result != null)
                {
                    appointment.AppId = result.AppId;
                    appointment.ProviderId = result.ProviderId;
                    appointment.SpecialtyID = result.SpecialtyId;
                    appointment.FacilityId = result.FacilityId;
                    appointment.SiteId = result.SiteId;
                    appointment.PurposeOfVisit =result.PurposeOfVisit;
                    appointment.PurposeOfVisitId = result.PurposeOfVisitId;
                    appointment.VisitTypeId = result.VisitTypeId;
                    appointment.AppDateTime = result.AppDateTime;
                    appointment.ReferredProviderId = result.ReferredProviderId;
                    appointment.AppTypeId = result.AppTypeId;
                    appointment.Duration = result.Duration;
                    appointment.LocationId = result.LocationId;
                    appointment.AppCriteriaId = result.AppCriteriaId;
                    appointment.PatientNotifiedId = result.PatientNotifiedId;
                    appointment.AppStatusId = result.AppStatusId;
                    appointment.PayerId = result.PayerId;
                    appointment.AppointmentClassification = result.AppointmentClassification;
                    appointment.PatientBalance = result.PatientBalance;
                    appointment.PlanBalance = result.PlanBalance;
                    appointment.PlanCopay = result.PlanCopay;
                    appointment.AppNote = result.AppNote;
                    appointment.PlanId = result.PlanId;
                    appointment.IsConsultationVisit = result.IsConsultationVisit;

                }
                return appointment;
            }

            catch (Exception ex) 
            {
                throw ex;
 
            }



        }
        public async Task<List<VwSpecialitybyFacilityid>> GetVwSpecialitybyFacilityid(int FacilityId)
        {
            try
            {
                var list = await System.Threading.Tasks.Task.Run(() => _context.VwSpecialitybyFacilityid.ToList());
                if (FacilityId != 0)
                {
                    list = list.Where(x => x.FacilityId == FacilityId).ToList();
                }
                return list;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<VwSitebySpecialityid>> GetSitebySpecialityId(int SpecialtyId)
        {
            try
            {
                var list = await System.Threading.Tasks.Task.Run(() => _context.VwSitebySpecialityid.ToList());
                if (SpecialtyId != 0)
                {
                    list = list.Where(x => x.SpecialtyId == SpecialtyId).ToList();
                }
                return list;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<VwProviderbySiteid>> GetProviderbySiteId(int SiteId)
        {
            try
            {
                var list = await System.Threading.Tasks.Task.Run(() => _context.VwProviderbySiteid.ToList());
                if (SiteId != 0)
                {
                    list = list.Where(x => x.TypeId == SiteId).ToList();
                }
                return list;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<VwProviderByFacilityId>> GetProviderByFacilityId(int FacilityId)
        {
            try
            {
                var list = await System.Threading.Tasks.Task.Run(() => _context.VwProviderByFacilityId.ToList());
                if (FacilityId != 0)
                {
                    list = list.Where(x => x.FacilityId == FacilityId).ToList();
                }
                return list;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<VwSpecialityByEmployeeId>> GetSpecialityByEmployeeId(int EmployeeId)
        {
            try
            {
                var list = await System.Threading.Tasks.Task.Run(() => _context.VwSpecialityByEmployeeId.ToList());
                if (EmployeeId != 0)
                {
                    list = list.Where(x => x.EmployeeId == EmployeeId).ToList();
                }
                return list;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<VwSiteByproviderId>> GetSiteByproviderId(int providerId)
        {
            try
            {
                var list = await System.Threading.Tasks.Task.Run(() => _context.VwSiteByproviderId.ToList());
                if (providerId != 0)
                {
                    list = list.Where(x => x.EmployeeId == providerId).ToList();
                }
                return list;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<object> GetTimeSlotbySiteId(int SiteId)
        {
            try
            {
                if (SiteId != 0)
                {
                    var Data = await System.Threading.Tasks.Task.Run(() => _context.RegLocationTypes.Where(x => x.TypeId == SiteId).FirstOrDefault());
                    return Data;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<object> GetTimeSlots(int SiteId, int ProviderId, int FacilityId, string Days)
        {
            try
            {

                var Data = await System.Threading.Tasks.Task.Run(() => _context.ProviderSchedule.Where(x =>
                x.FacilityId == FacilityId &&
                x.SiteId == SiteId && x.ProviderId == ProviderId && x.IsDeleted==false).ToList());
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
                throw new Exception(ex.Message);
            }
        }
        // public async Task<object> GetSchAppointmentList(int? SiteId, int? ProviderId, int? FacilityId, int? SpecialityId, string? Date)
        //{
        //     try
        //     {

        //         var Data = await System.Threading.Tasks.Task.Run(() => _context.VwRegPatientAndAppointmentdetails.Where(x => x.FacilityId == FacilityId && x.SiteId == SiteId && x.SpecialtyId == SpecialityId && x.ProviderId == ProviderId && x.IsDeleted == false).ToList());
        //         if (!string.IsNullOrEmpty(Date))
        //         {
        //             Data = Data.Where(x=>x.AppDateTime.Date == Convert.ToDateTime(Date).Date).ToList();
        //         }
        //         return Data;
        //     }
        //     catch (Exception ex)
        //     {
        //         throw new Exception(ex.Message);
        //     }
        // }
        public async Task<object> GetSchAppointmentList(int? SiteId, int? ProviderId, int? FacilityId, int? SpecialityId, string? Date)
        {
            try
            {
                var Data = await System.Threading.Tasks.Task.Run(() => _context.VwRegPatientAndAppointmentdetails.Where(x => x.IsDeleted == false).ToList());
                if (!(string.IsNullOrEmpty(Date)))
                {
                    var dt = Convert.ToDateTime(Date).Date;
                    Data = Data.Where(x => x.AppDateTime.Date == dt).ToList();
                }
                //if (!string.IsNullOrEmpty(Date))
                //{
                //    var dt = Convert.ToDateTime(Date).Date;
                //    Data = Data.Where(x => x.AppDateTime.Date == dt);
                //}

                if (SiteId != 0)
                {
                    Data = Data.Where(x => x.SiteId == SiteId).ToList();
                }
                if (ProviderId != 0)
                {
                    Data = Data.Where(x => x.ProviderId == ProviderId).ToList();
                }
                if (SpecialityId != 0)
                {
                    Data = Data.Where(x => x.SpecialtyId == SpecialityId).ToList();
                }
                return Data;

                //return new List<VwRegPatientAndAppointmentdetails>();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }





        //public async Task<string> AddBLPatientVisit(string Mrno,string Date,string user)
        //{
        //    string visitAcc = " ";
        //    var chkAppointment = await Task.Run(() => _context.SchAppointments.Where(x => x.IsDeleted == false && x.AppId == AppId).FirstOrDefault());
        //    if (chkAppointment != null)
        //    {
        //        var chkAppointmentCount = await Task.Run(() => _context.SchAppointments.Where(x => x.Mrno == Mrno && x.AppDateTime.Date.ToString() == Date && x.IsDeleted == false).Count());
        //        if (chkAppointment.VisitTypeId == 1)
        //        {
        //            visitAcc = "IP";
        //        }
        //        else if (chkAppointment.VisitTypeId == 2)
        //        {
        //            visitAcc = "OP";
        //        }
        //        else
        //        {
        //            visitAcc = "OP";
        //            chkAppointment.VisitTypeId = 2;
        //        }
        //        if (chkAppointmentCount == 1 || chkAppointmentCount == 0)
        //        {
        //            visitAcc = visitAcc + Mrno + chkAppointment.AppDateTime.ToString("yyMMdd") + 1;
        //        }
        //        else
        //        {
        //            chkAppointmentCount = chkAppointmentCount + 1;
        //            visitAcc = visitAcc + Mrno + chkAppointment.AppDateTime.ToString("yyMMdd") + chkAppointmentCount;
        //        }
        //        BlpatientVisit blpatient = new BlpatientVisit();
        //        blpatient.VisitAccDisplay = visitAcc;
        //        blpatient.VisitTypeId = chkAppointment.VisitTypeId;
        //        blpatient.AppointmentId = chkAppointment.AppId;
        //        blpatient.LastUpdatedBy = user;
        //        blpatient.LastUpdatedDate = DateTime.Now;
        //        blpatient.IsDeleted = false;
        //        await _context.BlpatientVisits.AddAsync(blpatient);
        //        await _context.SaveChangesAsync();
        //        return "SuccessFull";
        //    }
        //    return null;
        //}

        //public async Task<string> AddBLPatientVisit(BlPatientVisitModel req)
        //{
        //    string visitAcc = " ";
        //    var chkAppointment = await Task.Run(() => _context.SchAppointments.Where(x => x.IsDeleted == false && x.AppId == req.AppId).FirstOrDefault());
        //    if (chkAppointment != null)
        //    {
        //        var chkAppointmentCount = await Task.Run(() => _context.SchAppointments.Where(x => x.Mrno == req.Mrno && x.AppDateTime.Date.ToString() == req.Date && x.IsDeleted == false).Count());
        //        if (chkAppointment.VisitTypeId == 1)
        //        {
        //            visitAcc = "IP";
        //        }
        //        else if (chkAppointment.VisitTypeId == 2)
        //        {
        //            visitAcc = "OP";
        //        }
        //        else
        //        {
        //            visitAcc = "OP";
        //            chkAppointment.VisitTypeId = 2;
        //        }
        //        if (chkAppointmentCount == 1 || chkAppointmentCount == 0)
        //        {
        //            visitAcc = visitAcc + req.Mrno + chkAppointment.AppDateTime.ToString("yyMMdd") + 1;
        //        }
        //        else
        //        {
        //            chkAppointmentCount = chkAppointmentCount + 1;
        //            visitAcc = visitAcc + req.Mrno + chkAppointment.AppDateTime.ToString("yyMMdd") + chkAppointmentCount;
        //        }
        //        BlpatientVisit blpatient = new BlpatientVisit();
        //        blpatient.VisitAccDisplay = visitAcc;
        //        blpatient.VisitTypeId = chkAppointment.VisitTypeId;
        //        blpatient.AppointmentId = chkAppointment.AppId;
        //        blpatient.LastUpdatedBy = req.user;
        //        blpatient.LastUpdatedDate = DateTime.Now;
        //        blpatient.IsDeleted = false;
        //        await _context.BlpatientVisits.AddAsync(blpatient);
        //        await _context.SaveChangesAsync();
        //        return "SuccessFull";
        //    }
        //    return null;
        //}
        public async Task<DataSet> SearchAppointmentDBWithPagination(SchAppointmentIWithFilterRequest req)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@ProviderId", req.SchAppointmentList.providerId, DbType.Int64);
                param.Add("@LocationId", req.SchAppointmentList.locationId, DbType.Int64);
                param.Add("@SpecialityId", req.SchAppointmentList.specialityId, DbType.Int64);
                param.Add("@SiteId", req.SchAppointmentList.siteId, DbType.Int64);
                param.Add("@FacilityID", req.SchAppointmentList.facilityId, DbType.Int64);
                param.Add("@VisitTypeId", req.SchAppointmentList.visitTypeId, DbType.Int64);
                param.Add("@AppStatusId", req.SchAppointmentList.appointmentId, DbType.Int64);
                param.Add("@CriteriaId", req.SchAppointmentList.criteriaId, DbType.Int64);
                param.Add("@FromDate", req.SchAppointmentList.fromDate, DbType.String);
                param.Add("@ToDate", req.SchAppointmentList.toDate, DbType.String);
                param.Add("@Page", req.PaginationInfo.Page, DbType.Int64);
                param.Add("@PageSize", req.PaginationInfo.RowsPerPage, DbType.Int64);
                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("SchAppointmentsLoad_with_pagination", param);
                if (ds.Tables[0].Rows.Count == 0)
                {
                    return null;
                }
                return ds;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }
        }

        public async Task<bool> InsertSpeech(ClinicalNoteObj note)
        {
            string connectionString = Configuration.GetConnectionString("DefaultConnection");
            var patid = await _context.RegPatient.Where(x => x.Mrno == note.Mrno).Select(x => x.PatientId).FirstOrDefaultAsync();
            RegPatient regPatient = new RegPatient();
            regPatient.PatientId = patid; regPatient.Mrno = note.Mrno;
            var query = @"
                INSERT INTO SpeechToText
                (
                    PatientId, NoteHTMLText, NoteText, CreatedOn, MRNo,
                    NoteTitle, Description, CreatedBy, SignedBy, VisitDate,
                    IsDeleted, UpdatedBy, NotePath, AppointmentId
                )
                VALUES
                (
                    @PatientId, @NoteHTMLText, @NoteText, @CreatedOn, @MRNo,
                    @NoteTitle, @Description, @CreatedBy, @SignedBy, @VisitDate,
                    @IsDeleted, @UpdatedBy, @NotePath, @AppointmentId
                )";

            using (SqlConnection conn = new SqlConnection(connectionString))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@PatientId", (object?)regPatient.PatientId ?? 0);
                cmd.Parameters.AddWithValue("@NoteHTMLText", (object?)note.NoteHtmltext ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@NoteText", (object?)note.NoteText ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@CreatedOn", (object?)note.CreatedOn ?? DateTime.Now);
                cmd.Parameters.AddWithValue("@MRNo", note.Mrno);
                cmd.Parameters.AddWithValue("@AppointmentId", note.AppointmentId);
                cmd.Parameters.AddWithValue("@NoteTitle", note.NoteTitle);
                cmd.Parameters.AddWithValue("@Description", (object?)note.Description ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@CreatedBy", note.CreatedBy);
                cmd.Parameters.AddWithValue("@SignedBy", note.SignedBy);
                cmd.Parameters.AddWithValue("@VisitDate", (object?)note.VisitDate ?? DateTime.Now);
                cmd.Parameters.AddWithValue("@IsDeleted", (object?)note.IsDeleted ?? false); 
                cmd.Parameters.AddWithValue("@UpdatedBy", note.UpdatedBy);
                cmd.Parameters.AddWithValue("@NotePath", (object?)note.NotePath ?? DBNull.Value);

                await conn.OpenAsync();
                int rows = await cmd.ExecuteNonQueryAsync();
                return rows > 0;
            }

        }

        public async Task<DataSet> DashboardSearchAppointmentDB(
               DateTime? FromDate,
               DateTime? ToDate,
               int? ProviderID,
               int? LocationID,
               int? SpecialityID,
               int? SiteID,
               int? FacilityID,
               int? ReferredProviderId,
               long? PurposeOfVisitId,
               int? AppTypeId,
               int? VisitTypeId,
               string? LastUpdatedBy,
               //[FromQuery(Name = "ids")] 
               [FromQuery] List<int>? AppStatusIds,
               bool? ShowScheduledAppointmentOnly,
               int? Page, int? Size)
        {
            try
            {
                // ✅ Handle Null/Numeric Params (default = -1)
                ProviderID ??= -1;
                LocationID ??= -1;
                SpecialityID ??= -1;
                SiteID ??= -1;
                FacilityID ??= -1;
                ReferredProviderId ??= -1;
                PurposeOfVisitId ??= -1;
                AppTypeId ??= -1;
                VisitTypeId ??= -1;

                // ✅ Handle Paging
                Page ??= 1;
                Size ??= 10;

                // ✅ Convert Status IDs to comma separated string
                string? statusIdsCsv = (AppStatusIds != null && AppStatusIds.Any())
                    ? string.Join(",", AppStatusIds)
                    : null;

                DynamicParameters param = new DynamicParameters();


                // ✅ Date Handling
                if (FromDate == DateTime.MinValue || FromDate == null)
                    param.Add("@AppDate", DBNull.Value, DbType.DateTime);
                else
                    param.Add("@AppDate", FromDate, DbType.DateTime);

                // ✅ Normal Params
                param.Add("@ProviderId", ProviderID, DbType.Int64);
                param.Add("@LocationId", LocationID, DbType.Int64);
                param.Add("@SpecialityId", SpecialityID, DbType.Int64);
                param.Add("@SiteId", SiteID, DbType.Int64);
                param.Add("@FacilityID", FacilityID, DbType.Int64);
                param.Add("@ReferredProviderId", ReferredProviderId, DbType.Int64);
                param.Add("@PurposeOfVisitId", PurposeOfVisitId, DbType.Int64);
                param.Add("@AppTypeId", AppTypeId, DbType.Int64);
                param.Add("@VisitTypeId", VisitTypeId, DbType.Int64);
                param.Add("@LastUpdatedBy", LastUpdatedBy, DbType.String);

                // ✅ New Params (IDs as string & ShowScheduled flag)
                param.Add("@AppStatusIds", statusIdsCsv, DbType.String);
                param.Add("@ShowScheduledAppointmentOnly", ShowScheduledAppointmentOnly ?? false, DbType.Boolean);

                // ✅ Paging
                param.Add("@PagingSize", Size, DbType.Int32);
                param.Add("@OffsetValue", (Page - 1) * Size, DbType.Int32);

                // ✅ Call SP
                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("DashboardSchAppointmentsLoad", param);

                if (ds.Tables[0].Rows.Count == 0)
                    throw new Exception("No data found");

                return ds;
            }
            catch (Exception)
            {
                return new DataSet();
            }
        }

    }
}