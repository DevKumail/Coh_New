using AutoMapper;
using AutoMapper.Configuration.Annotations;
using Dapper;
using HMIS.Infrastructure.ORM;
using HMIS.Infrastructure.Repositories;
using HMIS.Core.Entities;
using HMIS.Application.DTOs.BillGeneratorDTOs;
using HMIS.Application.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Linq.Expressions;
using System.Runtime.ConstrainedExecution;
using System.Security.Principal;
using System.Text;
using Task = System.Threading.Tasks.Task;
using HMIS.Core.Context;

namespace HMIS.Application.ServiceLogics
{
    public class BillGeneratorManager : GenericRepositoryAsync<BlsuperBillDiagnosis>, IBillGeneratorManager
    {
        private readonly HMISDbContext _dbContext;
        public BillGeneratorManager(HMISDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }
       
        public async Task<DataSet> GetDiagnosis(long VisitAccountNo)
        {
            try
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@VisitAccountNo", VisitAccountNo);
                DataSet dataSet = await DapperHelper.GetDataSetBySP("BL_DiagnosisGet", parameters);
                if (dataSet.Tables.Count == 0)
                {
                    throw new Exception("No Data Found!");
                }
                return dataSet;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }
        }
        public async Task<DataSet> GetProcedures(long VisitAccountNo)
        {
            try
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@VisitAccountNo", VisitAccountNo);
                DataSet dataSet = await DapperHelper.GetDataSetBySP("BL_ProceduresGet", parameters);
                if (dataSet.Tables.Count == 0)
                {
                    throw new Exception("No Data Found!");
                }
                return dataSet;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }
        }
        public async Task<DataSet> GetDiagnosisDelete(long VisitAccountNo)
        {
            try
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@VisitAccountNo", VisitAccountNo);
                DataSet dataSet = await DapperHelper.GetDataSetBySP("BL_DiagnosisDeleteGet", parameters);
                if (dataSet.Tables.Count == 0)
                {
                    throw new Exception("No Data Found!");
                }
                return dataSet;
            }
            catch (Exception)
            {
                return new DataSet();
            }
        }
        
        public string GetChargeCaptureComments(long VisitAccountNo)
        {
            try
            {
                var comment = _dbContext.SchAppointment
                    .Where(x => x.VisitAccountNo == VisitAccountNo)
                    .Select(x => x.ChargeCaptureComments).FirstOrDefault().ToString();
                comment = (comment != null) ? comment : "";
                return comment;
            }
            catch (Exception ex)
            {
                return ex.Message;

            }
        }
        public async Task<DataSet> DeleteDiagnosis(long DiagnosisId, long VisitAccountNo, string IcdCode, string loginUser)
        {
            try
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@DiagnosisID", DiagnosisId);
                parameters.Add("@VisitAccountNo", VisitAccountNo);
                parameters.Add("@ICD9Code", IcdCode);
                parameters.Add("@loginUser", loginUser);

                DataSet dataSet = await DapperHelper.GetDataSetBySP("BL_Delete_Diagnosis", parameters);
                if (dataSet.Tables.Count == 0)
                {
                    throw new Exception("No Data Found!");
                }
                return dataSet;
            }
            catch (Exception)
            {
                return new DataSet();
            }

        }
    }
}
