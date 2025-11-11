using Azure.Core.Pipeline;
using Dapper;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.DTOs.Demographics;
using HMIS.Application.Implementations;
using HMIS.Core.Entities;
using HMIS.Infrastructure.ORM;
using System.Data;
using static Emgu.CV.Stitching.Stitcher;

namespace HMIS.Application.ServiceLogics
{
    public class PatientChartFamilyHistoryManager : IPatientChartFamilyHistoryManager
    {
        private readonly HMISDbContext _context;
        public PatientChartFamilyHistoryManager(HMISDbContext context)
        {
            _context = context;
        }


        public async Task<DataSet> GetAllSocialHistory(string? MRNo, int? PageNumber, int? PageSize)
        {
            //var list=_context.PatientChartSocialHistories.ToList();
            //return list;

            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@MRNo", MRNo);
                param.Add("@PageNumber", PageNumber);
                param.Add("@PageSize", PageSize);
                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("GetSocialHistory", param);
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


            //try
            //{
            //    DynamicParameters param = new DynamicParameters();
            //    DataSet ds = await DapperHelper.GetDataSetBySP("GetSocialHistory");
            //    if (ds.Tables[0].Rows.Count == 0)
            //    {

            //        return new DataSet();
            //        //throw new Exception("No data found");
            //    }
            //    return ds;
            //}
            //catch (Exception ex)
            //{
            //    return new DataSet();
            //}
        }

    

        public async Task<string> CreateSocialHistory(PatientChartFamilyHistoryModel model)
        {
            try
            {
                var Fpatient = _context.PatientChartSocialHistory.FirstOrDefault(x => x.Shid.Equals(model.shid));

                if (Fpatient == null)
                {
                    HMIS.Core.Entities.PatientChartSocialHistory patient = new HMIS.Core.Entities.PatientChartSocialHistory();
                    patient.ChartId = model.chartId;
                    patient.Shitem = model.shitem?.ToString();
                    patient.Mrno = model.mrno;
                    patient.CreatedBy = model.createdBy;
                    patient.CreatedDate = DateTime.Now;
                    patient.EndDate = model.endDate;
                    patient.StartDate = model.startDate;
                    patient.Active = model.active;
                    patient.AppId = model.AppointmentId;
                    _context.PatientChartSocialHistory.Add(patient);
                    await _context.SaveChangesAsync();

                }
                else
                {
                    Fpatient.Mrno = model.mrno;
                    Fpatient.ChartId = model.chartId;
                    Fpatient.Shitem = model.shitem?.ToString();
                    Fpatient.UpdatedBy = model.updatedBy;
                    Fpatient.UpdatedDate = DateTime.Now;
                    Fpatient.EndDate = model.endDate;
                    Fpatient.StartDate = model.startDate;
                    Fpatient.Active = model.active;
                    Fpatient.AppId = model.AppointmentId;
                    await _context.SaveChangesAsync();
                }

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
                    prob.Mrno = model.mrno;
                    prob.IsDeleted = false;
                    prob.AppointmentId = model.AppointmentId;
                    //prob.SocialHistory = true;
                    prob.Confidential = false;
                    //prob.EndDate = model.endDate;
                    _context.PatientProblem.Add(prob);
                }


            return "Save Successfully";
            }
            catch(Exception ex)
            {
                return ex.Message.ToString();
            }   
        }

        public async Task<bool> DeleteSocialHistoryByShId(long shid)
        {
            var CheckData = _context.PatientChartSocialHistory.Where(x => x.Shid == shid).SingleOrDefault();
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

        public async Task<DataSet> GetAllFamilyHistory(string? MRNo, int? PageNumber, int? PageSize)
        {
            //var list = _context.PatientChartFamilyHistories.ToList();
            //return list;

            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@MRNo", MRNo);
                param.Add("@PageNumber", PageNumber);
                param.Add("@PageSize", PageSize);
                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("GetFamilyHistory", param);
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

        public async Task<string> CreateFamilyHistory(PatientChartFamilyHistoryModel model)
        {
            try
            {


                var Fhpatient = _context.PatientChartFamilyHistory.FirstOrDefault(x => x.Fhid.Equals(model.fhid));

                if (Fhpatient == null)
                {
                    HMIS.Core.Entities.PatientChartFamilyHistory familypatient = new HMIS.Core.Entities.PatientChartFamilyHistory();
                    familypatient.ChartId = model.chartId;
                    familypatient.Fhitem = model.fhitem?.ToString();
                    familypatient.RelationShipId = int.Parse(model.relationShipId);
                    familypatient.Mrno = model.mrno;
                    familypatient.CreatedBy = model.createdBy;
                    familypatient.CreatedDate = DateTime.Now;
                    familypatient.Active = model.active;
                    familypatient.AppointmentId = model.AppointmentId;
                    _context.PatientChartFamilyHistory.Add(familypatient);
                    await _context.SaveChangesAsync();

                }
                else
                {
                    Fhpatient.Mrno = model.mrno;
                    Fhpatient.ChartId = model.chartId;
                    Fhpatient.Fhitem = model.fhitem?.ToString();
                    Fhpatient.RelationShipId = int.Parse(model.relationShipId);
                    Fhpatient.UpdatedBy = model.updatedBy;
                    Fhpatient.UpdatedDate = DateTime.Now;
                    Fhpatient.Active = model.active;
                    Fhpatient.AppointmentId = model.AppointmentId;
                    await _context.SaveChangesAsync();
                }







                //HMIS.Core.Entities.PatientChartFamilyHistory patient = new HMIS.Core.Entities.PatientChartFamilyHistory();

                //patient.ChartId = model.chartId;
                //patient.AppointmentId = model.AppointmentId;
                //patient.RelationShipId = int.Parse(model.relationShipId);
                //patient.Fhitem = model.fhitem;
                //patient.Mrno = model.mrno;
                //patient.CreatedBy = model.createdBy;
                //patient.CreatedDate = DateTime.Now;
                //patient.Active = true;
                //if (model.isProblemChecked == true)
                //{
                //    PatientProblem prob = new PatientProblem();
                    
               

                //}



                //_context.PatientChartFamilyHistory.Add(patient);
                //_context.SaveChangesAsync();
                return "Save Successfully";

            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }

        public async Task<bool> DeleteFamilyHistoryByFHID(long fhid)
        {
            var CheckData = _context.PatientChartFamilyHistory.Where(x => x.Fhid == fhid).SingleOrDefault();
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
