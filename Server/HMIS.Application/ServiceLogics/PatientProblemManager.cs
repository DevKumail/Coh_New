using Dapper;
using DocumentFormat.OpenXml.Wordprocessing;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.DTOs.ControlPanel;
using HMIS.Application.Implementations;
using HMIS.Core.Context;
using HMIS.Core.Entities;
using HMIS.Infrastructure.ORM;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;

namespace HMIS.Application.ServiceLogics
{
    public class PatientProblemManager : IPatientProblem
    {
        public IConfiguration Configuration { get; }
        private readonly HMISDbContext _context;

 
        public PatientProblemManager(HMISDbContext context, IConfiguration configuration)
        {
            _context = context;
            Configuration = configuration;
        }

        //public async Task<List<PatientProblem>> GetAllPatientProblems(string MRNo ,long UserId)
        //{
             
            
            
            
        //    return await _context.PatientProblems.ToListAsync();
        
        
        
        //}


        public async Task<DataSet> GetAllPatientProblems(bool? IsMedicalHistory, string MRNo, long UserId, int? PageNumber, int? PageSize)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@IsMedicalHistory", IsMedicalHistory);
                param.Add("@MRNo", MRNo);
                param.Add("@UserId", UserId);
                param.Add("@PageNumber", PageNumber);
                param.Add("@PageSize", PageSize);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("GetPatientProblemsByUserIdAndMRNo", param);
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
        //public async Task<PatientProblem> GetPatientProblem(long id)
        //{
        //    return await _context.PatientProblems.FirstOrDefaultAsync(pp => pp.Id == id);
        //}

        private bool Exist(long id)
        {
          
            var patient = _context.PatientProblem.Find(id);
            return patient != null;
        }
        public async Task<bool> InsertOrUpdatePatientProblem(PatientProblemModel patientProblem)
        {
            try
            {
                bool exist = Exist(patientProblem.Id);

                if(!exist)
                {
                    
                    var strtdate = patientProblem.Startstrdate;
                    //string[] parts = strtdate.Split('/');
                    //string year = parts[2].Substring(0, 4);
                    //var formattedstartdte = year +"/"+ parts[0] +"/"+ parts[1];

                    //var enddate = patientProblem.Endstrdate;
                    //string[] enddteparts = enddate.Split('/');
                    //string year1 = parts[2].Substring(0, 4);
                    ////var formattedenddte = year1 + "/" + enddteparts[0] + "/" + enddteparts[1];

                    var newPatientProblem = new PatientProblem();

                    newPatientProblem.AppointmentId = patientProblem.AppointmentId;
                    newPatientProblem.Icd9 = patientProblem.Icd9;
                    newPatientProblem.Icd9description = patientProblem.Icd9description;
                    newPatientProblem.Comments = patientProblem.Comments;
                    if (patientProblem.ProviderId != null)
                    {
                        newPatientProblem.ProviderId = patientProblem.ProviderId;

                    }
                   // newPatientProblem.OutsideClinic = patientProblem.providerDescription;
                    newPatientProblem.StartDate = patientProblem.StartDate;//patientProblem.StartDate,
                    newPatientProblem.EndDate = patientProblem.EndDate;//patientProblem.EndDate,
                    newPatientProblem.Status = patientProblem.Status;
                    newPatientProblem.Active = patientProblem.Active;
                    //newPatientProblem.UpdatedBy = patientProblem.UpdatedBy;
                    //newPatientProblem.UpdatedDate = DateTime.Now;
                    newPatientProblem.Mrno = patientProblem.Mrno;
                    newPatientProblem.CreatedBy = patientProblem.CreatedBy;
                    newPatientProblem.CreatedDate = DateTime.Now;
                    newPatientProblem.DiagnosisPriority = patientProblem.DiagnosisPriority;
                    newPatientProblem.DiagnosisType = patientProblem.DiagnosisType; 
                    newPatientProblem.Confidential = patientProblem.Confidential;
                    newPatientProblem.IsHl7msgCreated = patientProblem.IsHl7msgCreated;
                    newPatientProblem.IsMedicalHistory = patientProblem.IsMedicalHistory;
                    newPatientProblem.CaseId = patientProblem.CaseId;
                    newPatientProblem.ErrorReason = patientProblem.ErrorReason;
                    newPatientProblem.OldMrno = patientProblem.OldMrno;
                    newPatientProblem.IcdversionId = patientProblem.IcdversionId;
                    newPatientProblem.IsDeleted = patientProblem.IsDeleted;
                    newPatientProblem.PatientId = patientProblem.PatientId;
                    


                    _context.PatientProblem.Add(newPatientProblem);
                    await _context.SaveChangesAsync();
                    return true;
                }
                else if (exist)
                {
                    var patient = _context.PatientProblem
                        .Where(x => x.Id.Equals(patientProblem.Id)).FirstOrDefault();


                    if (patient != null)
                    {
                        // Map fields from patientProblem to patient
                        patient.AppointmentId = patientProblem.AppointmentId;
                        patient.Icd9 = patientProblem.Icd9;
                        patient.Icd9description = patientProblem.Icd9description;
                        patient.Comments = patientProblem.Comments;
                        if (patientProblem.ProviderId != null)
                        {
                            patient.ProviderId = patientProblem.ProviderId;

                        }
                        //patient.OutsideClinic = patientProblem.providerDescription;
                        //patient.ProviderId = patientProblem.ProviderId;
                        patient.StartDate = patientProblem.StartDate;
                        patient.EndDate = patientProblem.EndDate;
                        patient.Status = patientProblem.Status;
                        patient.Active = patientProblem.Active;
                        patient.UpdatedBy = patientProblem.UpdatedBy;
                        patient.UpdatedDate = DateTime.Now;
                        patient.Mrno = patientProblem.Mrno;
                      
                        patient.DiagnosisPriority = patientProblem.DiagnosisPriority;
                        patient.DiagnosisType = patientProblem.DiagnosisType;
                        patient.Confidential = patientProblem.Confidential;
                        patient.IsHl7msgCreated = patientProblem.IsHl7msgCreated;
                        patient.IsMedicalHistory = patientProblem.IsMedicalHistory;
                        patient.CaseId = patientProblem.CaseId;
                        patient.ErrorReason = patientProblem.ErrorReason;
                        patient.OldMrno = patientProblem.OldMrno;
                        patient.IcdversionId = patientProblem.IcdversionId;
                        patient.PatientId = patientProblem.PatientId;
                        patient.IsDeleted = patientProblem.IsDeleted;


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


            catch(Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> DeletePatientProblem(long Id)
        {
            try
            {
                var data = _context.PatientProblem.Where(x => x.Id == Id).FirstOrDefault();
                if (data != null)
                {
                    data.IsDeleted = true;
                    await _context.SaveChangesAsync();
                    return true;
                }
                return false;

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }



        //public async Task<bool> UpdatePatientProblem(PatientProblem patientProblem)
        //{
        //    try
        //    {
        //        _context.Entry(patientProblem).State = EntityState.Modified;
        //        await _context.SaveChangesAsync();
        //        return true;
        //    }
        //    catch
        //    {
        //        return false;
        //    }
        //}

    }
}
