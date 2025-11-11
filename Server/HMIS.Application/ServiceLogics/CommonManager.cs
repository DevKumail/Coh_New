using Dapper;
using DocumentFormat.OpenXml.Wordprocessing;
using HMIS.Application.Implementations;
using HMIS.Core.Entities;
using HMIS.Infrastructure.ORM;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static HMIS.Application.DTOs.SpLocalModel.DemographicListModel;

namespace HMIS.Application.ServiceLogics
{
    public class CommonManager : ICommonManager
    {
        private readonly HMISDbContext _context;
        public CommonManager(HMISDbContext context)
        {
            _context = context;
        }

        public async Task<DataSet> GetFamilyByMRNoDB(string MRNo)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@MRNo", MRNo, DbType.String);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("REG_GetPatientFamilyMembers", param);
                if (ds.Tables[0].Rows.Count == 0)
                {
                    throw new Exception("No data found");
                }

                return ds;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<DataSet> GetCoverageAndRegPatientDBByMrNo(string MRNo)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@MRNo", MRNo, DbType.String);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("Common_CoverageAndRegPatientGet", param);
                if (ds.Tables[1].Rows.Count == 0)
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
        public async Task<DataSet> GetCoverageAndRegPatientDB(FilterDemographicList req)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                string MRNo = req.DemographicList.Mrno;
                MRNo = MRNo == "-1" ? string.Empty : MRNo;
                param.Add("@MRNo", MRNo, DbType.String);
                param.Add("@GenderId", req.DemographicList.GenderId, DbType.Int32);
                param.Add("@Phone", req.DemographicList.Phone, DbType.String);
                param.Add("@Name", req.DemographicList.Name, DbType.String);
                param.Add("@Page", req.PaginationInfo.Page, DbType.String);
                param.Add("@@PageSize", req.PaginationInfo.RowsPerPage, DbType.String);


                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("Common_CoverageAndRegPatientGet", param);
                if (ds.Tables[1].Rows.Count == 0)
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
        public async Task<DataSet> GetRegPatientDB()
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                //param.Add("@MRNo", MRNo, DbType.String);

                //DataSet ds = await DapperHelper.GetDataSetBySPWithParams("Common_CoverageAndRegPatientGet", param);
                DataSet ds = await DapperHelper.GetDataSetBySP("REG_GetDemographicList");
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


        public async Task<(bool isSuccess, string message,DataSet ds)> GetAppointmentDetailsByMRNo(int? PageNumber, int? PageSize, string MRNo)
        {
            try
            {
                // Default safe values if frontend passes null
                int page = PageNumber ?? 1;
                int size = PageSize ?? 10;

                DynamicParameters param = new DynamicParameters();
                param.Add("@MRNo", MRNo, DbType.String);
                param.Add("@PageNumber", page, DbType.Int32);
                param.Add("@PageSize", size, DbType.Int32);

                // Call stored procedure (returns Table1 + Table2)
                DataSet ds = await DapperHelper.GetAppointmentDetails("GetAppointmentDetailByMRNo", param);

                if (ds.Tables[0].Rows.Count == 0)
                {
                    throw new Exception("No data found");
                }

                return (true , "" , ds);
            }
            catch (Exception ex)
            {
                // You can log ex.Message here for debugging
                return (false, ex.Message, new DataSet());
            }
        }




        public async Task<DataSet> GetInsurrancePayerInfo(long MRNo)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@MRNo", MRNo, DbType.Int64);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("SCH_GETPAYERINFOBYMR", param);
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

        public async Task<DataSet> GetDemographicDB(string VisitAccountDisplay)
        {
            try
            {

                //var visitAcc=  _context.BlpatientVisits.Where(x=>x.AppointmentId== Convert.ToInt64(VisitAccountDisplay)).
                //    Select(x=>x.VisitAccDisplay).FirstOrDefault();


                DynamicParameters param = new DynamicParameters();
                param.Add("@VisitAccountDisplay", VisitAccountDisplay);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("Common_GetDemographicByVisitAccountDisplay", param);
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



    }
}
