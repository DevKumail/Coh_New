using Azure.Core.Pipeline;
using Dapper;
using HMIS.Infrastructure.ORM;
using HMIS.Core.Entities;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.Implementations;
using System.Data;

namespace HMIS.Application.ServiceLogics
{
    public class PatientChartFamilyHistoryManager : IPatientChartFamilyHistoryManager
    {
        private readonly HMISDbContext _context;
        public PatientChartFamilyHistoryManager(HMISDbContext context)
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
            HMIS.Core.Entities.PatientChartSocialHistory patient=new HMIS.Core.Entities.PatientChartSocialHistory();
            patient.ChartId = model.chartId;
                patient.Shitem = model.shitem?.ToString();

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
                HMIS.Core.Entities.PatientChartFamilyHistory patient = new HMIS.Core.Entities.PatientChartFamilyHistory();

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
