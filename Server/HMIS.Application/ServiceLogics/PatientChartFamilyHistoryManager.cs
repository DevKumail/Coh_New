using Azure.Core.Pipeline;
using Dapper;
using HMIS.Common.ORM;
using HMIS.Data.Models;
using HMIS.Service.DTOs.Clinical;
using HMIS.Service.Implementations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SqlServer.Management.Assessment;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static HMIS.Service.DTOs.Clinical.PatientChartFamilyHistoryModel;

namespace HMIS.Service.ServiceLogics
{
    public class PatientChartFamilyHistoryManager : IPatientChartFamilyHistoryManager
    {
        private readonly HIMSDBContext _context;
        public PatientChartFamilyHistoryManager(HIMSDBContext context)
        {
            _context = context;
        }


        public async Task<DataSet> GetAllSocialHistory()
        {
            //var list=_context.PatientChartSocialHistories.ToList();
            //return list;
            try
            {
                DynamicParameters param = new DynamicParameters();
                DataSet ds = await DapperHelper.GetDataSetBySP("GetSocialHistory");
                if (ds.Tables[0].Rows.Count == 0)
                {

                    return new DataSet();
                    //throw new Exception("No data found");
                }
                return ds;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }
        }


        public async Task<string> CreateSocialHistory(PatientChartFamilyHistoryModel model)
        {
            try
            {
            HMIS.Data.Models.PatientChartSocialHistory patient=new HMIS.Data.Models.PatientChartSocialHistory();
            patient.ChartId = model.chartId;
            patient.Shitem = model.shitem;
            patient.Mrno = model.mrno;
              
            
            patient.CreatedBy = model.createdBy;
                //patient.CreatedDate= DateTime.Now;
                patient.CreatedDate = model.createdDate;

                patient.Active = true;
                if (model.isProblemChecked == true)
                {
                    PatientProblem prob = new PatientProblem();
                    prob.Icd9 = model.observationCode;
                    prob.Icd9description = model.shname;
                    prob.Comments = "Social";
                    prob.PatientId = model.patientId;
                    prob.ProviderId = model.createdBy;
                    prob.StartDate = null;
                    prob.EndDate = null;
                    prob.Status = 1;
                    prob.Active = false;
                    prob.CreatedBy = model.createdBy;
                    prob.CreatedDate = model.createdDate;
                    prob.Mrno= model.mrno;
                    prob.IsDeleted = false;
                    prob.AppointmentId = model.AppointmentId;
                    //prob.SocialHistory = true;
                    prob.Confidential = false;
                    //prob.EndDate = model.endDate;

                    _context.PatientProblems.Add(prob);
                     
                }


            _context.PatientChartSocialHistories.Add(patient);
            _context.SaveChangesAsync();
            return "Save Successfully";
            }
            catch(Exception ex)
            {
                return ex.Message.ToString();
            }   
        }

        public async Task<bool> DeleteSocialHistoryByShId(long shid)
        {
            var CheckData = _context.PatientChartSocialHistories.Where(x => x.Shid == shid).SingleOrDefault();
            if (CheckData != null)
            {
                _context.Remove(CheckData);
                _context.SaveChanges();
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<DataSet> GetAllFamilyHistory()
        {
            //var list = _context.PatientChartFamilyHistories.ToList();
            //return list;
            try
            {
                DynamicParameters param = new DynamicParameters();
                DataSet ds = await DapperHelper.GetDataSetBySP("GetFamilyHistory");
                if (ds.Tables[0].Rows.Count == 0)
                {

                    return new DataSet();
                    //throw new Exception("No data found");
                }
                return ds;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }
        }

        public async Task<string> CreateFamilyHistory(PatientChartFamilyHistoryModel model)
        {
            try
            {
                HMIS.Data.Models.PatientChartFamilyHistory patient = new HMIS.Data.Models.PatientChartFamilyHistory();

                patient.ChartId = model.chartId;
                //patient.RelationShip = model.relationShip;
                patient.AppointmentId = model.AppointmentId;
                patient.RelationShipId = int.Parse(model.relationShipId);
                patient.Fhitem = model.fhitem;
                patient.Mrno = model.mrno;
                //patient.VisitAccountNo = model.visitAccountNo;
                patient.CreatedBy = model.createdBy;
                patient.CreatedDate = DateTime.Now;
                patient.Active = true;
                if (model.isProblemChecked == true)
                {
                    PatientProblem prob = new PatientProblem();
                    
               

                }



                _context.PatientChartFamilyHistories.Add(patient);
                _context.SaveChangesAsync();
                return "Save Successfully";

            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }

        public async Task<bool> DeleteFamilyHistoryByFHID(long fhid)
        {
            var CheckData = _context.PatientChartFamilyHistories.Where(x => x.Fhid == fhid).SingleOrDefault();
            if (CheckData != null)
            {
                _context.Remove(CheckData);
                _context.SaveChanges();
                return true;
            }
            else
            {
                return false;
            }
        }

      
    }
}
