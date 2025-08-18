using AutoMapper.Execution;
using Dapper;
using HMIS.Infrastructure.ORM;
using HMIS.Core.Entities;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.Implementations;
using Microsoft.Extensions.Configuration;
using Microsoft.SqlServer.Management.Smo;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Application.ServiceLogics
{
    public class PatientProcedureManager : IPatientProcedure
    {
        public IConfiguration Configuration { get; }
        private readonly HMISDbContext _context;


        public PatientProcedureManager(HMISDbContext context, IConfiguration configuration)
        {
            _context = context;
            Configuration = configuration;
        }



        public async Task<DataSet> GetAllPatientProcedure(string MRNo)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@MRNo", MRNo);
                //param.Add("@UserId", UserId);
                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("GetPatientProcedureByMRNo", param);
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
 
        private bool Exist(long id)
        {

            var patient = _context.PatientProcedures.Find(id);
            return patient != null;
        }
         
        public async Task<bool> InsertOrUpdatePatientProcedure(PatientProcedureModel patientProcedure)
        {
            try
            {
                bool exist = Exist(patientProcedure.Id);

                if (!exist)
                {
                    var newPatientProc = new PatientProcedure();

                    newPatientProc.AppointmentId = patientProcedure.AppointmentId;
                   newPatientProc.UpdatedBy = patientProcedure.UpdatedBy;
                    newPatientProc.UpdatedDate = DateTime.Now;
                    newPatientProc.CreatedBy = patientProcedure.CreatedBy;
                    newPatientProc.CreatedDate = DateTime.Now;
                    newPatientProc.Cptcode = patientProcedure.Cptcode ?? "CPT";
                    newPatientProc.Active = patientProcedure.Active;
                    newPatientProc.AssociatedDiagnosisCode = patientProcedure.AssociatedDiagnosisCode ?? "test";
                    newPatientProc.ErrorReason = patientProcedure.ErrorReason ?? "test";
                    newPatientProc.Comments = patientProcedure.Comments ;
                    newPatientProc.IsDeleted = false;
                    newPatientProc.OldMrno = "test";
                    newPatientProc.IsHl7msgCreated = patientProcedure.IsHl7msgCreated;
                    newPatientProc.PerformedOnFacility = (bool)patientProcedure.PerformedOnFacility;
                    newPatientProc.PrimaryAnestheticId = patientProcedure.PrimaryAnestheticId ?? "test";
                    newPatientProc.ProcedureDateTime = DateTime.Now;
                    newPatientProc.ProcedureEndDateTime = patientProcedure.ProcedureEndDateTime;
                    newPatientProc.ProcedureDescription = patientProcedure.ProcedureDescription;
                    newPatientProc.ProcedurePriority = patientProcedure.ProcedurePriority ?? "test";
                    newPatientProc.ProcedureType = patientProcedure.ProcedureType ?? null;
                    if (patientProcedure.ProviderId != null)
                    {
                        newPatientProc.ProviderId = patientProcedure.ProviderId;

                    }
                    newPatientProc.AnesthesiaStartDateTime = patientProcedure.AnesthesiaStartDateTime;
                    newPatientProc.AnesthesiaEndDateTime = patientProcedure.AnesthesiaEndDateTime;
                    newPatientProc.Mrno = patientProcedure.Mrno ?? "test";
                    newPatientProc.IsLabTest = false;
                   // newPatientProc.OutsideClinic = patientProcedure.providerDescription;


                    _context.PatientProcedures.Add(newPatientProc);
                    await _context.SaveChangesAsync();
                    return true;

                }
                else
                {
                    var patient = _context.PatientProcedures.FirstOrDefault(x => x.Id.Equals(patientProcedure.Id));

                    if (patient != null)
                    {
                        patient.AppointmentId = patientProcedure.AppointmentId;
                        patient.UpdatedBy = patientProcedure.UpdatedBy;
                        patient.UpdatedDate = patientProcedure.UpdatedDate;
                     //   patient.CreatedBy = patientProcedure.CreatedBy;
                       // patient.CreatedDate = patientProcedure.CreatedDate;
                        patient.Cptcode = patientProcedure.Cptcode ?? "CPT";
                        patient.Active = patientProcedure.Active;
                        patient.AssociatedDiagnosisCode = patientProcedure.AssociatedDiagnosisCode ?? "test";
                        patient.ErrorReason = patientProcedure.ErrorReason ?? "test";
                        patient.Comments = patientProcedure.Comments;
                        patient.IsDeleted = false;
                        patient.OldMrno = patientProcedure.OldMrno;
                        patient.IsHl7msgCreated = patientProcedure.IsHl7msgCreated;
                        patient.PerformedOnFacility = (bool)patientProcedure.PerformedOnFacility;
                        patient.PrimaryAnestheticId = patientProcedure.PrimaryAnestheticId;
                        patient.ProcedureDateTime = patientProcedure.ProcedureDateTime;
                        patient.ProcedureDescription = patientProcedure.ProcedureDescription;
                        patient.ProcedurePriority = patientProcedure.ProcedurePriority;
                        patient.ProcedureType = patientProcedure.ProcedureType;
                        if(patientProcedure.ProviderId!= null)
                        {
                            patient.ProviderId = patientProcedure.ProviderId;
                        }
                        patient.AnesthesiaStartDateTime = patientProcedure.AnesthesiaStartDateTime;
                        patient.AnesthesiaEndDateTime = patientProcedure.AnesthesiaEndDateTime;
                        patient.Mrno = patientProcedure.Mrno;
                        //patient.OutsideClinic = patientProcedure.providerDescription;
                        patient.IsLabTest = false;

                        await _context.SaveChangesAsync();
                        return true;
                    }
                }

                return false;

            }
            catch(Exception ex)
            {
                throw ex;
            }

        }

        public async Task<bool> DeletePatientProcedure(long Id)
        {

            try
            {
                var data = _context.PatientProcedures.Where(x => x.Id == Id).FirstOrDefault();
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
        public async Task<DataSet> GetProcedureList(long Id , string ProcedureStartCode, string ProcedureEndCode, string DescriptionFilter)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                //param.Add("@MRNo", MRNo);
                param.Add("@CptStartCode", ProcedureStartCode);
                param.Add("@CptEndCode", ProcedureEndCode);
                param.Add("@DescriptionFilter", DescriptionFilter);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("GetProcedureList", param);
                if (ds.Tables[0].Rows.Count == 0)
                {

                    return new DataSet();
                    //throw new Exception("No data found");
                }
                return ds;



            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public async Task<DataSet> GetChargeCaptureProcedureList(long Id, string ProcedureStartCode, string ProcedureEndCode, string DescriptionFilter, long ProcedureTypeId)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                //param.Add("@MRNo", MRNo);
                param.Add("@CptStartCode", ProcedureStartCode);
                param.Add("@CptEndCode", ProcedureEndCode);
                param.Add("@DescriptionFilter", DescriptionFilter);
                param.Add("@ProcedureTypeId", ProcedureTypeId);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("GetChargeCaptureProcedureList", param);
                if (ds.Tables[0].Rows.Count == 0)
                {

                    return new DataSet();
                    //throw new Exception("No data found");
                }
                return ds;



            }
            catch (Exception ex)
            {
                throw ex;
            }

        }


    }
}
