using Dapper;
using Emgu.CV.Ocl;
using HMIS.Infrastructure.ORM;
using HMIS.Core.Entities;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.Implementations;
using Microsoft.AspNetCore.Mvc;
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

        public async Task<DataSet> GetAlertDeatilsDB(string mrno)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@MRNo", Convert.ToInt16(mrno));
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
        public async Task<bool> InsertOrUpdateAlert(Alerts_Model alertModel)
        {
            try
            {
                bool exit = Exist(alertModel.AlertId);
                if (!exit)
                {
                    var newPatientAlert = new PatientAlert();

                    //newPatientAlert.AlertId = alertModel.AlertId;  
                    newPatientAlert.RuleId = alertModel.RuleId;
                    newPatientAlert.Mrno = alertModel.Mrno;
                    newPatientAlert.AlertMessage = alertModel.AlertMessage;
                    newPatientAlert.Active = alertModel.Active;

                    // Fix for CS0029: Convert string to DateTime?  
                    newPatientAlert.EnteredDate = alertModel.EnteredDate;
                    newPatientAlert.RepeatDate = alertModel.RepeatDate;

                    newPatientAlert.IsFinished = alertModel.IsFinished;
                    newPatientAlert.EnteredBy = alertModel.EnteredBy;
                    newPatientAlert.UpdatedBy = alertModel.UpdatedBy;
                    newPatientAlert.AppointmentId = alertModel.AppointmentId;
                    newPatientAlert.AlertTypeId = alertModel.AlertTypeId;
                    newPatientAlert.Comments = alertModel.Comments;
                    newPatientAlert.HasChild = alertModel.HasChild;
                    newPatientAlert.OldMrno = alertModel.OldMrno;
                    newPatientAlert.IsDeleted = alertModel.IsDeleted;
                    newPatientAlert.StartDate = alertModel.StartDate;
                    _context.PatientAlerts.Add(newPatientAlert);
                    await _context.SaveChangesAsync();
                    return true;

                }
                else if (exit)
                {
                    var patient = _context.PatientAlerts
                        .Where(x => x.AlertId.Equals(alertModel.AlertId)).FirstOrDefault();

                    if (patient != null)
                    {
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

                        _context.PatientAlerts.Update(patient);

                        await _context.SaveChangesAsync();
                        return true;
                    }
                    else
                    {
                        return false;
                    }

                }
                return false;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}

