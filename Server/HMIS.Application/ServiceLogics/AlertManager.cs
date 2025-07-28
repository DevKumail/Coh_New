using Dapper;
using Emgu.CV.Ocl;
using HMIS.Common.ORM;
using HMIS.Data.Models;
using HMIS.Service.DTOs.Clinical;
using HMIS.Service.Implementations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.ServiceLogics
{
    public class AlertManager : IAlertManager
    {
        public IConfiguration Configuration { get; }
        private readonly HIMSDBContext _context;

        public AlertManager(HIMSDBContext context, IConfiguration configuration)
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
                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("", param);
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

                    newPatientAlert.AlertId = alertModel.AlertId;
                    newPatientAlert.RuleId = alertModel.RuleId;
                    newPatientAlert.Mrno = alertModel.Mrno;
                    newPatientAlert.AlertMessage = alertModel.AlertMessage;
                    newPatientAlert.Active = alertModel.Active;
                    newPatientAlert.RepeatDate = alertModel.RepeatDate;
                    newPatientAlert.IsFinished = alertModel.IsFinished;
                    newPatientAlert.EnteredBy = alertModel.EnteredBy;
                    newPatientAlert.EnteredDate = alertModel.EnteredDate;
                    newPatientAlert.UpdatedBy = alertModel.UpdatedBy;
                    newPatientAlert.AppointmentId = alertModel.AppointmentId;
                    newPatientAlert.AlertTypeId = alertModel.AlertTypeId;
                    newPatientAlert.Comments = alertModel.Comments;
                    newPatientAlert.HasChild = alertModel.HasChild;
                    newPatientAlert.OldMrno = alertModel.OldMrno;
                    newPatientAlert.IsDeleted = alertModel.IsDeleted;

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
                        patient.AlertId = alertModel.AlertId;
                        //patient.RuleId = alertModel.RuleId;
                        //patient.Mrno = alertModel.Mrno;
                        //patient.AlertMessage = alertModel.AlertMessage;
                        //patient.Active = alertModel.Active;
                        //patient.RepeatDate = alertModel.RepeatDate;
                        //patient.IsFinished = alertModel.IsFinished;
                        //patient.EnteredBy = alertModel.EnteredBy;
                        //patient.EnteredDate = alertModel.EnteredDate;
                        //patient.UpdatedBy = alertModel.UpdatedBy;
                        //patient.AppointmentId = alertModel.AppointmentId;
                        //patient.AlertTypeId = alertModel.AlertTypeId;
                        patient.Comments = alertModel.Comments;
                        patient.HasChild = alertModel.HasChild;
                        patient.OldMrno = alertModel.OldMrno;
                        patient.IsDeleted = alertModel.IsDeleted;

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

