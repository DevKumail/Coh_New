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
using HMIS.Core.Context;

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

            var patient = _context.PatientProcedure.Find(id);
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
                    newPatientProc.CreatedBy = patientProcedure.CreatedBy;
                    newPatientProc.CreatedDate = DateTime.Now;
                    newPatientProc.Cptcode = patientProcedure.Cptcode ?? "CPT";
                    newPatientProc.Active = patientProcedure.Active;
                    newPatientProc.Comments = patientProcedure.Comments;
                    newPatientProc.IsDeleted = false;
                    newPatientProc.PerformedOnFacility = (bool)patientProcedure.PerformedOnFacility;
                    newPatientProc.ProcedureDateTime = patientProcedure.ProcedureDateTime;
                    newPatientProc.ProcedureEndDateTime = patientProcedure.ProcedureEndDateTime ?? null;
                    newPatientProc.ProcedureDescription = patientProcedure.ProcedureDescription;
                    newPatientProc.ProcedureType = patientProcedure.ProcedureType ?? null;
                        newPatientProc.ProviderId = patientProcedure.ProviderId;
                    newPatientProc.ProviderName = patientProcedure.ProviderName;
                    newPatientProc.Mrno = patientProcedure.Mrno;

                    _context.PatientProcedure.Add(newPatientProc);
                    await _context.SaveChangesAsync();
                    return true;

                }
                else
                {
                    var patient = _context.PatientProcedure.FirstOrDefault(x => x.Id.Equals(patientProcedure.Id));

                    if (patient != null)
                    {
                        patient.AppointmentId = patientProcedure.AppointmentId;
                        patient.UpdatedBy = patientProcedure.UpdatedBy;
                        patient.UpdatedDate = DateTime.Now; ;
                        patient.Cptcode = patientProcedure.Cptcode ?? "CPT";
                        patient.Active = patientProcedure.Active;
                        patient.Comments = patientProcedure.Comments;
                        patient.IsDeleted = false;
                        patient.PerformedOnFacility = (bool)patientProcedure.PerformedOnFacility;
                        patient.ProcedureDateTime = patientProcedure.ProcedureDateTime;
                        patient.ProcedureEndDateTime = patientProcedure.ProcedureEndDateTime ?? null;
                        patient.ProcedureDescription = patientProcedure.ProcedureDescription;
                        patient.ProcedureType = patientProcedure.ProcedureType;
                            patient.ProviderId = patientProcedure.ProviderId;
                        patient.ProviderName = patientProcedure.ProviderName;
                        patient.Mrno = patientProcedure.Mrno;
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
                var data = _context.PatientProcedure.Where(x => x.Id == Id).FirstOrDefault();
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


        //public async Task<DataSet> GetProcedureList(int? PageNumber, int? PageSize, string? ProcedureStartCode, string? ProcedureEndCode, string? DescriptionFilter)
        //{
        //    try
        //    {
        //        DynamicParameters param = new DynamicParameters();
        //        param.Add("@PageNumber", PageNumber);
        //        param.Add("@PageSize", PageSize);
        //        param.Add("@CptStartCode", ProcedureStartCode);
        //        param.Add("@CptEndCode", ProcedureEndCode);
        //        param.Add("@DescriptionFilter", DescriptionFilter);

        //        DataSet ds = await DapperHelper.GetDataSetBySPWithParams("GetProcedureList", param);
        //        if (ds.Tables[0].Rows.Count == 0)
        //        {

        //            return new DataSet();
        //            //throw new Exception("No data found");
        //        }
        //        return ds;



        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }

        //}


        public async Task<DataSet> GetProcedureList(string? ProcedureStartCode, string? ProcedureEndCode, string? DescriptionFilter, int? PageNumber, int? PageSize)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@CptStartCode", ProcedureStartCode);
                param.Add("@CptEndCode", ProcedureEndCode);
                param.Add("@DescriptionFilter", DescriptionFilter);
                param.Add("@PageNumber", PageNumber);
                param.Add("@PageSize", PageSize);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("GetProcedureList", param);
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
