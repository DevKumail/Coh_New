using Dapper;
using DocumentFormat.OpenXml.Wordprocessing;
using Emgu.CV.Ocl;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.Implementations;
using HMIS.Core.Context;
using HMIS.Core.Entities;
using HMIS.Infrastructure.ORM;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.ServiceLogics
{
    public class AlertManager : IAlertManager
    {
        public IConfiguration Configuration { get; }
        private readonly HMISDbContext _context;

        public AlertManager(HMISDbContext context, IConfiguration configuration)
        {
            _context = context;
            Configuration = configuration;
        }

        public async Task<DataSet> GetAlertDeatilsDB(string mrno,int? PageNumber,int?  PageSize)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@MRNo", Convert.ToInt16(mrno));
                param.Add("@PageNumber ",PageNumber );
                param.Add("@PageSize", PageSize);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("GetPatientAlertsByMRNO", param);
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

        private bool Exist(long id)
        {
            var Alert = _context.PatientAlerts.Find(id);
            return Alert != null;
        }
        //public async Task<bool> InsertOrUpdateAlert(Alerts_Model alertModel)
        //{
        //    try
        //    {
        //        bool exit = Exist(alertModel.AlertId);
        //        if (!exit)
        //        {
        //            var newPatientAlert = new PatientAlert();

        //            //newPatientAlert.AlertId = alertModel.AlertId;  
        //            newPatientAlert.RuleId = alertModel.RuleId;
        //            newPatientAlert.Mrno = alertModel.Mrno;
        //            newPatientAlert.AlertMessage = alertModel.AlertMessage;
        //            newPatientAlert.Active = alertModel.Active;

        //            // Fix for CS0029: Convert string to DateTime?  

        //            // Fix for CS0029: Convert string to DateTime?  
        //            newPatientAlert.EnteredDate = string.IsNullOrWhiteSpace(alertModel.EnteredDate)
        //                                        ? null
        //                                        : DateTime.Parse(alertModel.EnteredDate);
        //            newPatientAlert.RepeatDate = string.IsNullOrWhiteSpace(alertModel.RepeatDate)
        //                                        ? null
        //                                        : DateTime.Parse(alertModel.RepeatDate);


        //            newPatientAlert.IsFinished = alertModel.IsFinished;
        //            newPatientAlert.EnteredBy = alertModel.EnteredBy;
        //            newPatientAlert.UpdatedBy = alertModel.UpdatedBy;
        //            newPatientAlert.AppointmentId = alertModel.AppointmentId;
        //            newPatientAlert.AlertTypeId = alertModel.AlertTypeId;
        //            newPatientAlert.Comments = alertModel.Comments;
        //            newPatientAlert.HasChild = alertModel.HasChild;
        //            newPatientAlert.OldMrno = alertModel.OldMrno;
        //            newPatientAlert.IsDeleted = alertModel.IsDeleted;
        //            newPatientAlert.StartDate = alertModel.StartDate;
        //            _context.PatientAlerts.Add(newPatientAlert);
        //            await _context.SaveChangesAsync();
        //            return true;

        //        }
        //        else if (exit)
        //        {
        //            var patient = _context.PatientAlerts
        //                .Where(x => x.AlertId.Equals(alertModel.AlertId)).FirstOrDefault();

        //            if (patient != null)
        //            {
        //                patient.RuleId = alertModel.RuleId;
        //                patient.Mrno = alertModel.Mrno;
        //                patient.AlertMessage = alertModel.AlertMessage;
        //                patient.Active = alertModel.Active;
        //                patient.EnteredDate = string.IsNullOrWhiteSpace(alertModel.EnteredDate)
        //                                        ? null
        //                                        : DateTime.Parse(alertModel.EnteredDate);
        //                patient.RepeatDate = string.IsNullOrWhiteSpace(alertModel.RepeatDate)
        //                                        ? null
        //                                        : DateTime.Parse(alertModel.RepeatDate);
        //                patient.IsFinished = alertModel.IsFinished;
        //                patient.EnteredBy = alertModel.EnteredBy;
        //                patient.UpdatedBy = alertModel.UpdatedBy;
        //                patient.AppointmentId = alertModel.AppointmentId;
        //                patient.AlertTypeId = alertModel.AlertTypeId;
        //                patient.Comments = alertModel.Comments;
        //                patient.HasChild = alertModel.HasChild;
        //                patient.OldMrno = alertModel.OldMrno;
        //                patient.IsDeleted = alertModel.IsDeleted;
        //                patient.StartDate = alertModel.StartDate;

        //                _context.PatientAlerts.Update(patient);

        //                await _context.SaveChangesAsync();
        //                return true;
        //            }
        //            else
        //            {
        //                return false;
        //            }

        //        }
        //        return false;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}

        public async Task<bool> InsertOrUpdateAlert(Alerts_Model alertModel)
        {
            try
            {
                if (alertModel.AlertId == 0)
                {
                    var newPatientAlert = new PatientAlerts
                    {
                        RuleId = alertModel.RuleId,
                        Mrno = alertModel.Mrno,
                        AlertMessage = alertModel.AlertMessage,
                        Active = alertModel.Active,
                        EnteredDate = string.IsNullOrWhiteSpace(alertModel.EnteredDate)
                                        ? null
                                        : DateTime.Parse(alertModel.EnteredDate),
                        RepeatDate = string.IsNullOrWhiteSpace(alertModel.RepeatDate)
                                        ? null
                                        : DateTime.Parse(alertModel.RepeatDate),
                        IsFinished = alertModel.IsFinished,
                        EnteredBy = alertModel.EnteredBy,
                        UpdatedBy = alertModel.UpdatedBy,
                        AppointmentId = alertModel.AppointmentId,
                        AlertTypeId = alertModel.AlertTypeId,
                        Comments = alertModel.Comments,
                        HasChild = alertModel.HasChild,
                        OldMrno = alertModel.OldMrno,
                        IsDeleted = alertModel.IsDeleted,
                        StartDate = alertModel.StartDate,
                        UpdatedDate = DateTime.Now
                    };

                    _context.PatientAlerts.Add(newPatientAlert);
                    await _context.SaveChangesAsync();
                    return true;
                }
                else
                {
                    var patient = await _context.PatientAlerts
                        .FirstOrDefaultAsync(x => x.AlertId == alertModel.AlertId);

                    if (patient == null)
                        return false;

                    patient.RuleId = alertModel.RuleId;
                    patient.Mrno = alertModel.Mrno;
                    patient.AlertMessage = alertModel.AlertMessage;
                    patient.Active = alertModel.Active;
                    patient.EnteredDate = string.IsNullOrWhiteSpace(alertModel.EnteredDate)
                                            ? null
                                            : DateTime.Parse(alertModel.EnteredDate);
                    patient.RepeatDate = string.IsNullOrWhiteSpace(alertModel.RepeatDate)
                                            ? null
                                            : DateTime.Parse(alertModel.RepeatDate);
                    patient.IsFinished = alertModel.IsFinished;
                    patient.EnteredBy = alertModel.EnteredBy;
                    patient.UpdatedBy = alertModel.UpdatedBy;
                    patient.AppointmentId = alertModel.AppointmentId;
                    patient.AlertTypeId = alertModel.AlertTypeId;
                    patient.Comments = alertModel.Comments;
                    patient.HasChild = alertModel.HasChild;
                    patient.OldMrno = alertModel.OldMrno;
                    patient.IsDeleted = alertModel.IsDeleted;
                    patient.StartDate = alertModel.StartDate;
                    patient.UpdatedDate = DateTime.Now;

                    _context.PatientAlerts.Update(patient);
                    await _context.SaveChangesAsync();
                    return true;
                }
            }
            catch (FormatException ex)
            {
                // Yeh tab chalega jab date parsing fail ho
                Console.WriteLine($"Date parsing error: {ex.Message}");
                throw new Exception("Invalid date format provided in alert model.", ex);
            }
            catch (DbUpdateException ex)
            {
                // EF database update exception
                Console.WriteLine($"Database update error: {ex.Message}");
                throw new Exception("Database operation failed while inserting/updating alert.", ex);
            }
            catch (Exception ex)
            {
                // General exception
                Console.WriteLine($"Unexpected error: {ex.Message}");
                throw new Exception("An unexpected error occurred while saving the alert.", ex);
            }
        }

    }
}

