using AutoMapper;
using Dapper;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Wordprocessing;
using Emgu.CV.Ocl;
using HMIS.Application.DTOs.ChargeCaptureDTOs;
using HMIS.Application.Implementations;
using HMIS.Core.Context;
using HMIS.Core.Entities;
using HMIS.Infrastructure.Helpers;
using HMIS.Infrastructure.ORM;
using HMIS.Infrastructure.Repositories;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using Task = System.Threading.Tasks.Task;

namespace HMIS.Application.ServiceLogics
{
    public class ChargeCaptureManager : GenericRepositoryAsync<BlsuperBillDiagnosis>, IChargeCaptureManager
    {
        private readonly IMapper _mapper;
        private readonly HMISDbContext _dbContext;
        public ChargeCaptureManager(IMapper mapper, HMISDbContext dbContext) : base(dbContext)
        {
            this._mapper = mapper;
            _dbContext = dbContext;
        }



        public async Task<DataSet> CC_MyCptCodeGetDB(long ProviderId, long? GroupId, long? PayerId, int?PageNumber, int? PageSize)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@ProviderId", ProviderId);

                param.Add("@GroupId", GroupId);

                param.Add("@PayerId", PayerId);

                param.Add("@PageNumber", PageNumber);
                param.Add("@PageSize", PageSize);



                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("BL_CC_MyCPTCodeGet", param);
                if (ds.Tables[0].Rows.Count == 0)
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

        public async Task<DataSet> CC_MyDiagnosisCodeDB(long ProviderId, long? GroupId, long? ICDVersionId, int? PageNumber, int? PageSize)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@ProviderId", ProviderId);
                param.Add("@GroupId", GroupId);
                param.Add("@ICDVersionId", ICDVersionId);
                param.Add("@PageNumber", PageNumber);
                param.Add("@PageSize", PageSize);


                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("BL_CC_MyDiagnosisCodeGet", param);
                if (ds.Tables[0].Rows.Count == 0)
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

        public async Task<DataSet> CC_DiagnosisCodeDB(int? ICDVersionId, string? DiagnosisStartCode, string? DiagnosisEndCode, string? DescriptionFilter, int? @PageNumber, int? PageSize)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@ICDVersionId", ICDVersionId);
                param.Add("@DiagnosisStartCode", DiagnosisStartCode);
                param.Add("@DiagnosisEndCode", DiagnosisEndCode);
                param.Add("@DescriptionFilter", DescriptionFilter);
                param.Add("@PageNumber", PageNumber);
                param.Add("@PageSize", PageSize);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("BL_CC_DiagnosisCodeGet", param);
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

        public async Task<DataSet> CC_CPTCodeDB(int? AllCPTCode, string? CPTStartCode, string? CPTEndCode, string? Description, int? pageNumber, int? pageSize)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                if (AllCPTCode == -1)
                {
                    param.Add("@AllCPTCode", AllCPTCode);
                }
                else
                {
                    param.Add("@CPTStartCode", CPTStartCode);
                    param.Add("@EndCodeRange", CPTEndCode);
                    param.Add("@DescriptionFilter", Description);
                    param.Add("@PageNumber", pageNumber);
                    param.Add("@PageSize", pageSize);

                }

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("BL_CC_CPTCodeGet", param);

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

        public async Task<DataSet> CC_MyDentalCodeDB(long ProviderId, long? GroupId, string? ProviderDescription, string? DentalCode, long? PayerId)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@ProviderId", ProviderId);

                param.Add("@GroupId", GroupId);

                param.Add("@ProviderDescription", ProviderDescription);

                param.Add("@DentalCode", DentalCode);

                param.Add("@PayerId", PayerId);



                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("BL_CC_MyDentalCodeGet", param);
                if (ds.Tables[0].Rows.Count == 0)
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
        public async Task<DataSet> CC_DentalCodeDB(int? AllDentalCode, string? DentalStartCode, string? DentalEndCode, string? DescriptionFilter, int? pageNumber, int? pageSize)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                if (AllDentalCode == -1)
                {
                    param.Add("@AllDentalCode", AllDentalCode);
                }
                else
                {
                    param.Add("@DentalStartCode", DentalStartCode);
                    param.Add("@EndCodeRange", DentalEndCode);
                    param.Add("@DescriptionFilter", DescriptionFilter);
                    param.Add("@PageNumber", pageNumber);
                    param.Add("@PageSize", pageSize);


                }

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("BL_CC_DentalsCodeGet", param);

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

        public async Task<DataSet> CC_MyHCPCSCodeDB(long ProviderId, long? GroupId, string? HCPCSCode, string? DescriptionFilter, long? PayerId)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@ProviderId", ProviderId);

                param.Add("@GroupId", GroupId);

                param.Add("@HCPCSCode", HCPCSCode);

                param.Add("@DescriptionFilter", DescriptionFilter);

                param.Add("@PayerId", PayerId);



                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("BL_CC_MyHCPCSCodeGet", param);
                if (ds.Tables[0].Rows.Count == 0)
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

        public async Task<DataSet> CC_HCPCSCodeDB(int? AllHCPCSCode, string? HCPCStartCode, string? HCPCSEndCode, string? DescriptionFilter, int? pageNumber, int? pageSize)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                if (AllHCPCSCode == -1)
                {
                    param.Add("@AllHCPCSCode", AllHCPCSCode);
                }
                else
                {
                    param.Add("@HCPCStartCode", HCPCStartCode);
                    param.Add("@EndCodeRange", HCPCSEndCode);
                    param.Add("@DescriptionFilter", DescriptionFilter);
                    param.Add("@PageNumber", pageNumber);
                    param.Add("@PageSize", pageSize);

                }

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("BL_CC_HCPCSCodesGet", param);

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

        public async Task<DataSet> CC_UnclassifiedServiceDB(int? AllCode, string? UCStartCode, string? DescriptionFilter, int? pageNumber, int? pageSize)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                if (AllCode == -1)
                {
                    param.Add("@AllCode", AllCode);
                }
                else
                {
                    param.Add("@UCStartCode", UCStartCode);
                    param.Add("@DescriptionFilter", DescriptionFilter);
                    param.Add("@PageNumber", pageNumber);
                    param.Add("@PageSize", pageSize);

                }

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("BL_CC_UnclassifiedServiceGet", param);

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

        public async Task<DataSet> CC_ServiceItemsDB(int? AllCode, string? ServiceStartCode, string? DescriptionFilter, int? pageNumber, int? pageSize)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                if (AllCode == -1)
                {
                    param.Add("@AllCode", AllCode);
                }
                else
                {
                    param.Add("@ServiceStartCode", ServiceStartCode);
                    param.Add("@DescriptionFilter", DescriptionFilter);
                    param.Add("@PageNumber", pageNumber);
                    param.Add("@PageSize", pageSize);


                }

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("BL_CC_ServiceItemsGet", param);

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

        public async Task<bool> InsertMyDiagnosisCodeGridDB(List<BLSuperBillDiagnosis> bl)
        {
            try

            {
                DataTable blSuperBillDiagnosisDT = ConversionHelper.ToDataTable(bl);



                DynamicParameters parameters = new DynamicParameters();


                parameters.Add("@BLSuperBillDignosisTypeVar", blSuperBillDiagnosisDT, DbType.Object);


                bool res = await DapperHelper.ExcecuteSPByParams("BL_InsertSuperBillDignosisGrid", parameters);
                return res;




            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<string> UpdateMyDiagnosisDB(List<BLSuperBillDiagnosis> bl)
        {
            try

            {
                DataTable blSuperBillDiagnosisDT = ConversionHelper.ToDataTable(bl);


                DynamicParameters parameters = new DynamicParameters();

                parameters.Add("@BLSuperBillDignosisTypeVar", blSuperBillDiagnosisDT, DbType.Object);


                bool res = await DapperHelper.ExcecuteSPByParams("BL_UpdateSuperBillDignosisGrid", parameters);

                if (res == true)
                {
                    return "OK";
                }

                return string.Empty;
            }
            catch (Exception ex)
            {

                return (ex.Message);
            }
        }

        public async Task<bool> InsertAllGridDB(List<BLSuperBillProcedure> sb)
        {
            try

            {
                DataTable blSuperBillDiagnosisDT = ConversionHelper.ToDataTable(sb);



                DynamicParameters parameters = new DynamicParameters();


                parameters.Add("@BLSuperBillProcedureTypeVar", blSuperBillDiagnosisDT, DbType.Object);


                bool res = await DapperHelper.ExcecuteSPByParams("BLSuperBillProcedureInsert", parameters);
                return res;




            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<string> UpdateMyProcedureDB(List<BLSuperBillProcedure> sb)
        {
            try

            {
                DataTable blSuperBillDiagnosisDT = ConversionHelper.ToDataTable(sb);



                DynamicParameters parameters = new DynamicParameters();


                parameters.Add("@BLSuperBillProcedureTypeVar", blSuperBillDiagnosisDT, DbType.Object);


                bool res = await DapperHelper.ExcecuteSPByParams("BL_SuperBillProcedureUpdate", parameters);

                if (res == true)
                {
                    return "OK";
                }

                return string.Empty;
            }
            catch (Exception ex)
            {

                return (ex.Message);
            }
        }


        public async Task<DataSet> CC_GridDataDB(long VisitAccountNo)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@VisitAccountNo", VisitAccountNo);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("BL_CC_GetSuperBillDataByVisitAccount", param);

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

        public async Task<List<Blicd9cmgroup>> GetICD9CMGroupByProvider(long? Id)
        {
            var result = new Blicd9cmgroup();
            var DbData = await Task.Run(() => _dbContext.Blicd9cmgroup.Where(x => x.ProviderId == Id).OrderByDescending(x => x.GroupId).ToListAsync());

            return DbData;
        }



        //public async Task<DataSet> GetCPT9Group(long? ProviderId)
        //{
        //    var connectionString = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("ConnectionStrings")["DefaultConnection"];
        //    DataSet dataset;
        //    using (SqlConnection connection = new SqlConnection(connectionString))
        //    {
        //        connection.Open();

        //        string sqlQuery = "select * from BLICD9CMGroup";



        //        using (SqlDataAdapter adapter = new SqlDataAdapter(sqlQuery, connection))
        //        {

        //            //adapter.Fill(dataset);
        //            // You can also specify additional settings for the adapter if needed
        //        }

        //        using (SqlCommand command = new SqlCommand(sqlQuery, connection))
        //        {


        //            //var list = command.ExecuteReaderAsync();
        //            //DataSet ds = await DapperHelper.ConvertDataReaderToDataSet(list);
        //            //dataset = ConvertDataReaderToDataSet(list);

        //            // Execute the query and get the results
        //            //using (SqlDataReader reader = command.ExecuteReader())
        //            //{

        //            //    var Result = await DapperHelper.ConvertDataReaderToDataSet(reader);
        //            //    // Read data from the reader
        //            //    while (reader.Read())
        //            //    {
        //            //        // Access columns using reader["ColumnName"] or reader.GetOrdinal("ColumnName")

        //            //    }
        //            //}
        //        }
        //    }
        //    //return "";m
        //}


        //public async Task<String> SaveChargeCapture(ChargCaptureModel input)
        //{
        //    try
        //    {
        //        List<BlSuperBillProcedureModel> blSuperBillProcedures = _mapper.Map<List<BlSuperBillProcedureModel>>(input.blSuperBillProcedureModel);

        //        List<BLSupperBillDiagnosisModel> bLSupperBillDiagnosis = _mapper.Map<List<BLSupperBillDiagnosisModel>>(input.BLSupperBillDiagnosisModel);

        //        var updateComment = _dbContext.SchAppointment.SingleOrDefault(e => e.AppId == input.AppointmentId);

        //        if (blSuperBillProcedures.Count > 0)
        //        {
        //            List<BlsuperBillProcedure> ls = new List<BlsuperBillProcedure>();
        //            foreach (var BillProcedure in blSuperBillProcedures)
        //            {
        //                BillProcedure.TypeOfService = Convert.ToString(
        //                    await _dbContext.TypeOfServiceMaster
        //                    .Where(x => x.Name == BillProcedure.ProcedureType)
        //                    .Select(x => x.ServiceTypeId)
        //                    .FirstOrDefaultAsync()
        //                    );


        //                //decimal? price = 0;
        //                decimal? price = await GetProcedureUnitPrice(Convert.ToInt16(BillProcedure.TypeOfService), BillProcedure.ProcedureCode, updateComment.ProviderId, Convert.ToInt64(input.PayerId), Convert.ToInt64(BillProcedure.UnclassifiedId));
        //                ;


        //                BlsuperBillProcedure bLSuperBill = new BlsuperBillProcedure
        //                {
        //                    ProcedureType = BillProcedure.ProcedureType,
        //                    ProcedureCode = BillProcedure.ProcedureCode,
        //                    Description = BillProcedure.Description,
        //                    ToothCode = BillProcedure.ToothCode,
        //                    DateOfServiceFrom = DateTime.Now,
        //                    DateOfServiceTo = DateTime.Now,
        //                    CreatedDate = DateTime.Now,
        //                    PlaceOfService = "11",
        //                    TypeOfService = BillProcedure.TypeOfService,
        //                    CreatedBy = BillProcedure.CreatedBy,
        //                    AppointmentId = input.AppointmentId,
        //                    Units = BillProcedure.Units,
        //                    UnitPrice = price,
        //                    Modifier1 = BillProcedure.Modifier1,
        //                    Modifier2 = BillProcedure.Modifier2,
        //                    Modifier3 = BillProcedure.Modifier3,
        //                    Modifier4 = BillProcedure.Modifier4
        //                };
        //                ls.Add(bLSuperBill);
        //                _dbContext.BlsuperBillProcedure.Add(bLSuperBill);

        //                if (BillProcedure.ProcedureType == "CPT")
        //                {
        //                    var getCptId = await _dbContext.ProcedureType.Where(x => x.Type == BillProcedure.ProcedureType).Select(x => x.Id).FirstOrDefaultAsync();
        //                    PatientProcedure patientProcedure = new PatientProcedure()
        //                    {
        //                        ProviderId = Convert.ToInt64(BillProcedure.CreatedBy),
        //                        Cptcode = BillProcedure.ProcedureType,
        //                        ProcedureDescription = BillProcedure.Description,
        //                        ProcedureDateTime = System.DateTime.UtcNow,
        //                        ProcedureType = getCptId,
        //                        Active = 1,
        //                        ProcedurePriority = BillProcedure.ProcedurePriority,
        //                        AssociatedDiagnosisCode = BillProcedure.AssociatedDiagnosisCode,
        //                        PrimaryAnestheticId = BillProcedure.PrimaryAnestheticId.ToString(),
        //                        TypeOfAnesthesia = BillProcedure.TypeOfAnesthesia,
        //                        AnesthesiaStartDateTime = BillProcedure.AnesthesiaStartDateTime,
        //                        AnesthesiaEndDateTime = BillProcedure.AnesthesiaEndDateTime,
        //                        PerformedOnFacility = true,
        //                        IsHl7msgCreated = BillProcedure.IsHl7msgCreated,
        //                        IsLabTest = BillProcedure.IsLabTest

        //                    };
        //                    _dbContext.PatientProcedure.Add(patientProcedure);
        //                }
        //            }
        //            if (updateComment != null)
        //            {
        //                updateComment.ChargeCaptureComments = input.Comment;
        //            }
        //            await _dbContext.SaveChangesAsync();
        //            //return "OK";
        //        }
        //        if (bLSupperBillDiagnosis.Count > 0)
        //        {
        //            foreach (var Diagnosis in bLSupperBillDiagnosis)
        //            {
        //                // Call ValidateChargeCapture with a list containing the current diagnosis
        //                //var message = await ValidateChargeCapture(new List<BlsuperBillDiagnosis> { Diagnosis }, input.VisitAccountNo, input.EmployeeId);

        //                //_dbContext.BlsuperBillDiagnoses.Add(Diagnosis);
        //                var EmpName = await _dbContext.Hremployee.Where(x => x.EmployeeId == Convert.ToInt64(Diagnosis.CreatedBy)).FirstOrDefaultAsync();

        //                BlsuperBillDiagnosis blsuperBillDiagnosis = new BlsuperBillDiagnosis()
        //                {
        //                    CreatedBy = EmpName.FullName,
        //                    CreatedDate = DateTime.Now,
        //                    Descriptionshort = Diagnosis.Descriptionshort,
        //                    DiagnosisPriority = Diagnosis.DiagnosisPriority,
        //                    DiagnosisType = Diagnosis.DiagnosisType,
        //                    Icd9code = Diagnosis.Icd9code,
        //                    Icdorder = Diagnosis.Icdorder,
        //                    IcdversionId = Diagnosis.IcdversionId,
        //                    IsHl7msgCreated = Diagnosis.IsHl7msgCreated,
        //                    Type = Diagnosis.Type,
        //                    YearofOnset = Diagnosis.YearofOnset,
        //                    LastUpdatedBy = EmpName.FullName,
        //                    LastUpdatedDate = DateTime.Now,
        //                    AppointmentId = Diagnosis.VisitAccountNo
        //                };
        //                _dbContext.BlsuperBillDiagnosis.Add(blsuperBillDiagnosis);
        //            }
        //            await _dbContext.SaveChangesAsync();
        //            //return "OK";
        //        }
        //        return "OK";

        //        //return null;
        //    }
        //    catch (Exception ex)
        //    {
        //        //return ex.ToString();
        //        return "Something went wrong while saving";
        //    }

        //    //    List<BlsuperBillDiagnosis> bLSupperBillDiagnosis = _mapper.Map<List<BlsuperBillDiagnosis>>(input.BLSupperBillDiagnosisModel);


        //    //    BlsuperBillProcedure? blsuperBillProcedure = await Task.Run(() => _dbContext.BlsuperBillProcedures.Where(x => x.AppointmentId == input.VisitAccountNo).FirstOrDefaultAsync());
        //    //    //BlpatientVisit? blpatientVisitTab = await Task.Run(() => _dbContext.SchAppointments.Where(x => x.VisitAccountNo == input.VisitAccountNo).FirstOrDefaultAsync());
        //    //    SchAppointment? SchAppointmentTab = await Task.Run(() => _dbContext.SchAppointments.Where(x => x.VisitAccountNo == input.VisitAccountNo)
        //    //    .FirstOrDefaultAsync());

        //    //    BlsuperBillDiagnosis? blsuperBillDiagnosisTab = _dbContext.BlsuperBillDiagnoses.Where(x => x.AppointmentId == input.BLSupperBillDiagnosisModel[0].VisitAccountNo).FirstOrDefault();

        //    //    foreach (var Diagnosis in bLSupperBillDiagnosis)
        //    //    {
        //    //        // Call ValidateChargeCapture with a list containing the current diagnosis
        //    //        var message = await ValidateChargeCapture(new List<BlsuperBillDiagnosis> { Diagnosis }, input.VisitAccountNo, input.EmployeeId);

        //    //        _dbContext.BlsuperBillDiagnoses.Add(Diagnosis);
        //    //    }

        //    //    _dbContext.BlsuperBillProcedures.Add(blsuperBillProcedure);

        //    //    return "";



        //    //}
        //    //catch (Exception ex)
        //    //{
        //    //    return ex.ToString();
        //    //}
        //}



        public async Task<string> SaveChargeCapture(ChargCaptureModel input)
        {
            try
            {
                List<BlSuperBillProcedureModel> blSuperBillProcedures = _mapper.Map<List<BlSuperBillProcedureModel>>(input.blSuperBillProcedureModel);
                List<BLSupperBillDiagnosisModel> bLSupperBillDiagnosis = _mapper.Map<List<BLSupperBillDiagnosisModel>>(input.BLSupperBillDiagnosisModel);

                var updateComment = await _dbContext.SchAppointment.SingleOrDefaultAsync(e => e.AppId == input.AppointmentId);

                // ✅ Handle Procedures (Insert or Update)
                if (blSuperBillProcedures != null && blSuperBillProcedures.Count > 0)
                {
                    foreach (var billProcedure in blSuperBillProcedures)
                    {
                        // Get TypeOfServiceId
                        billProcedure.TypeOfService = Convert.ToString(await _dbContext.TypeOfServiceMaster
                            .Where(x => x.Name == billProcedure.ProcedureType)
                            .Select(x => x.ServiceTypeId)
                            .FirstOrDefaultAsync());

                        // Get Unit Price
                        decimal? price = await GetProcedureUnitPrice(
                            Convert.ToInt16(billProcedure.TypeOfService),
                            billProcedure.ProcedureCode,
                            updateComment.ProviderId,
                            Convert.ToInt64(input.PayerId),
                            Convert.ToInt64(billProcedure.UnclassifiedId));

                        // ✅ Check if Procedure exists (Update case)
                        var existingProcedure = await _dbContext.BlsuperBillProcedure
                            .FirstOrDefaultAsync(x => x.ProcedureId == billProcedure.ProcedureId);

                        if (existingProcedure != null)
                        {
                            // Update existing record
                            existingProcedure.ProcedureType = billProcedure.ProcedureType;
                            existingProcedure.ProcedureCode = billProcedure.ProcedureCode;
                            existingProcedure.Description = billProcedure.Description;
                            existingProcedure.ToothCode = billProcedure.ToothCode;
                            existingProcedure.LastUpdatedDate = DateTime.Now;
                            existingProcedure.PlaceOfService = "11";
                            existingProcedure.TypeOfService = billProcedure.TypeOfService;
                            existingProcedure.Units = billProcedure.Units;
                            existingProcedure.UnitPrice = price;
                            existingProcedure.Modifier1 = billProcedure.Modifier1;
                            existingProcedure.Modifier2 = billProcedure.Modifier2;
                            existingProcedure.Modifier3 = billProcedure.Modifier3;
                            existingProcedure.Modifier4 = billProcedure.Modifier4;
                            existingProcedure.LastUpdatedBy = billProcedure.CreatedBy;
                        }
                        else
                        {
                            // Insert new record
                            BlsuperBillProcedure newProc = new BlsuperBillProcedure
                            {
                                ProcedureType = billProcedure.ProcedureType,
                                ProcedureCode = billProcedure.ProcedureCode,
                                Description = billProcedure.Description,
                                ToothCode = billProcedure.ToothCode,
                                DateOfServiceFrom = DateTime.Now,
                                DateOfServiceTo = DateTime.Now,
                                CreatedDate = DateTime.Now,
                                PlaceOfService = "11",
                                TypeOfService = billProcedure.TypeOfService,
                                CreatedBy = billProcedure.CreatedBy,
                                AppointmentId = input.AppointmentId,
                                Units = billProcedure.Units,
                                UnitPrice = price,
                                Modifier1 = billProcedure.Modifier1,
                                Modifier2 = billProcedure.Modifier2,
                                Modifier3 = billProcedure.Modifier3,
                                Modifier4 = billProcedure.Modifier4
                            };
                            _dbContext.BlsuperBillProcedure.Add(newProc);
                        }

                        // ✅ Also handle CPT insertion into PatientProcedure table
                        if (billProcedure.ProcedureType == "CPT")
                        {
                            var getCptId = await _dbContext.ProcedureType
                                .Where(x => x.Type == billProcedure.ProcedureType)
                                .Select(x => x.Id)
                                .FirstOrDefaultAsync();

                            PatientProcedure patientProcedure = new PatientProcedure
                            {
                                ProviderId = Convert.ToInt64(billProcedure.CreatedBy),
                                Cptcode = billProcedure.ProcedureType,
                                ProcedureDescription = billProcedure.Description,
                                ProcedureDateTime = DateTime.UtcNow,
                                ProcedureType = getCptId,
                                Active = 1,
                                ProcedurePriority = billProcedure.ProcedurePriority,
                                AssociatedDiagnosisCode = billProcedure.AssociatedDiagnosisCode,
                                PrimaryAnestheticId = billProcedure.PrimaryAnestheticId?.ToString(),
                                TypeOfAnesthesia = billProcedure.TypeOfAnesthesia,
                                AnesthesiaStartDateTime = billProcedure.AnesthesiaStartDateTime,
                                AnesthesiaEndDateTime = billProcedure.AnesthesiaEndDateTime,
                                PerformedOnFacility = true,
                                IsHl7msgCreated = billProcedure.IsHl7msgCreated,
                                IsLabTest = billProcedure.IsLabTest
                            };
                            _dbContext.PatientProcedure.Add(patientProcedure);
                        }
                    }

                    if (updateComment != null)
                        updateComment.ChargeCaptureComments = input.Comment;

                    await _dbContext.SaveChangesAsync();
                }

                // ✅ Handle Diagnoses (Insert or Update)
                if (bLSupperBillDiagnosis != null && bLSupperBillDiagnosis.Count > 0)
                {
                    foreach (var diagnosis in bLSupperBillDiagnosis)
                    {
                        var emp = await _dbContext.Hremployee.FirstOrDefaultAsync(x => x.EmployeeId == Convert.ToInt64(diagnosis.CreatedBy));

                        // Check if diagnosis exists
                        var existingDiagnosis = await _dbContext.BlsuperBillDiagnosis
                            .FirstOrDefaultAsync(x => x.DiagnosisId == diagnosis.DiagnosisId);

                        if (existingDiagnosis != null)
                        {
                            // Update existing
                            existingDiagnosis.Descriptionshort = diagnosis.Descriptionshort;
                            existingDiagnosis.DiagnosisPriority = diagnosis.DiagnosisPriority;
                            existingDiagnosis.DiagnosisType = diagnosis.DiagnosisType;
                            existingDiagnosis.Icd9code = diagnosis.Icd9code;
                            existingDiagnosis.Icdorder = diagnosis.Icdorder;
                            existingDiagnosis.IcdversionId = diagnosis.IcdversionId;
                            existingDiagnosis.IsHl7msgCreated = diagnosis.IsHl7msgCreated;
                            existingDiagnosis.Type = diagnosis.Type;
                            existingDiagnosis.YearofOnset = diagnosis.YearofOnset;
                            existingDiagnosis.LastUpdatedBy = emp?.FullName;
                            existingDiagnosis.LastUpdatedDate = DateTime.Now;
                        }
                        else
                        {
                            // Insert new
                            BlsuperBillDiagnosis newDiag = new BlsuperBillDiagnosis
                            {
                                CreatedBy = emp?.FullName,
                                CreatedDate = DateTime.Now,
                                Descriptionshort = diagnosis.Descriptionshort,
                                DiagnosisPriority = diagnosis.DiagnosisPriority,
                                DiagnosisType = diagnosis.DiagnosisType,
                                Icd9code = diagnosis.Icd9code,
                                Icdorder = diagnosis.Icdorder,
                                IcdversionId = diagnosis.IcdversionId,
                                IsHl7msgCreated = diagnosis.IsHl7msgCreated,
                                Type = diagnosis.Type,
                                YearofOnset = diagnosis.YearofOnset,
                                LastUpdatedBy = emp?.FullName,
                                LastUpdatedDate = DateTime.Now,
                                AppointmentId = diagnosis.VisitAccountNo
                            };
                            _dbContext.BlsuperBillDiagnosis.Add(newDiag);
                        }
                    }
                    await _dbContext.SaveChangesAsync();
                }

                return "OK";
            }
            catch (Exception ex)
            {
                return $"Something went wrong while saving: {ex.Message}";
            }
        }





        //private double GetProcedureUnitPrice(int procedureType, string procedureCode, long providerId, long payerId)
        //{
        //    double price = 0.00;

        //    try
        //    {
        //        #region CPT Procedure Unit Price by Payer Id
        //        // Get UnitPrice from CPT Master Table
        //        if (procedureType == 3)
        //        {
        //            price = Convert.ToDouble(_dbContext.BlmasterCpts.Where(x => x.Cptcode == procedureCode).FirstOrDefault().Price);

        //            //In case payerId is given
        //            if (payerId > 0)
        //            {
        //                var groupids = _dbContext.Blcptgroups.Where(x => x.ProviderId == providerId).ToList();
        //                double cptPayerPrice = 0.00;
        //                foreach (var gId in groupids)
        //                {
        //                    cptPayerPrice = Convert.ToDouble(_dbContext.BlcptgroupCodes.Where(x => x.GroupId == gId.GroupId && x.Cptcode == procedureCode && x.PayerId == payerId).FirstOrDefault().UnitPrice);
        //                }



        //                price = cptPayerPrice;
        //            }
        //        }
        //        #endregion
        //        return price;

        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }
        //    return price;

        //}
        private async Task<decimal> GetProcedureUnitPrice(int procedureType, string? procedureCode, long providerId, long? payerId, long UnclassifiedId)
        {
            double price = 0.00;

            try
            {
                if (procedureType == 3) //CPT
                {
                    // Get base price from CPT Master Table
                    var cpt = await _dbContext.BlmasterCpt.FirstOrDefaultAsync(x => x.Cptcode == procedureCode);
                    if (cpt != null && cpt.Price.HasValue)
                    {
                        price = Convert.ToDouble(cpt.Price.Value);
                    }
                    // If payerId is given
                    if (payerId > 0)
                    {
                        var groupIds = await _dbContext.Blcptgroup.Where(x => x.ProviderId == providerId).Select(x => x.GroupId).ToListAsync();
                        // Try to get specific payer-based price
                        var cptPayer = await _dbContext.BlcptgroupCode.FirstOrDefaultAsync(x => groupIds.Contains(x.GroupId) && x.Cptcode == procedureCode && x.PayerId == payerId);
                        if (cptPayer != null && cptPayer.UnitPrice.HasValue)
                        {
                            price = Convert.ToDouble(cptPayer.UnitPrice.Value);
                        }
                    }
                }
                else if (procedureType == 4)    //HCPCS
                {
                    // Get base price from HCPCS Master Table
                    var hcpcs = await _dbContext.BlmasterHcpcs.FirstOrDefaultAsync(x => x.Hcpcscode == procedureCode);
                    if (hcpcs != null && hcpcs.Price.HasValue)
                    {
                        price = Convert.ToDouble(hcpcs.Price.Value);
                    }
                    // If payerId is given
                    if (payerId > 0)
                    {
                        var groupIds = await _dbContext.Blhcpcsgroup.Where(x => x.ProviderId == providerId).Select(x => x.GroupId).ToListAsync();
                        // Try to get specific payer-based price
                        var cptPayer = await _dbContext.BlhcpcsgroupCode.FirstOrDefaultAsync(x => groupIds.Contains(x.GroupId) && x.Hcpcscode == procedureCode && x.PayerId == payerId);
                        if (cptPayer != null && cptPayer.UnitPrice.HasValue)
                        {
                            price = Convert.ToDouble(cptPayer.UnitPrice.Value);
                        }
                    }
                }
                else if (procedureType == 6)    //Dental
                {
                    // Get base price from Dental Master Table
                    var dental = await _dbContext.BlmasterDentalCodes.FirstOrDefaultAsync(x => x.DentalCode == procedureCode);
                    if (dental != null && dental.Price.HasValue)
                    {
                        price = Convert.ToDouble(dental.Price.Value);
                    }
                    // If payerId is given
                    if (payerId > 0)
                    {
                        var groupIds = await _dbContext.BldentalGroup.Where(x => x.ProviderId == providerId).Select(x => x.GroupId).ToListAsync();
                        // Try to get specific payer-based price
                        var cptPayer = await _dbContext.BldentalGroupCode.FirstOrDefaultAsync(x => groupIds.Contains(x.GroupId) && x.DentalCode == procedureCode && x.PayerId == payerId);
                        if (cptPayer != null && cptPayer.UnitPrice.HasValue)
                        {
                            price = Convert.ToDouble(cptPayer.UnitPrice.Value);
                        }
                    }
                }

                else if (procedureType == 8)    //Service and Others
                {
                    // Get base price from Unclassified Service Master Table
                    var service = await _dbContext.BlunclassifiedCodes.FirstOrDefaultAsync(x => x.UnclassifiedId == UnclassifiedId);
                    if (service != null && service.UnitPrice.HasValue)
                    {
                        price = Convert.ToDouble(service.UnitPrice.Value);
                    }
                }

                return Convert.ToDecimal(price);
            }
            catch (Exception ex)
            {
                return 0;
            }
        }


        public async Task<string> ValidateChargeCapture(List<BlsuperBillDiagnosis> Diagnoses, long VisitAccountNo, long EmployeeId)
        {
            try
            {
                // Declare variables to hold the error message and employee status
                string ErrorMessage = "";

                // Check if an invoice is already generated for the visit
                int InvoiceGeneratedCount = await _dbContext.SchAppointment
                    .Where(x => x.VisitAccountNo == VisitAccountNo && x.IsInvoiceGenerated == true)
                    .CountAsync();

                if (InvoiceGeneratedCount > 0)
                {
                    ErrorMessage = "Invoice for this visit is already generated.";
                    return ErrorMessage;
                }

                // Check if patient status is Checked-In
                int PatientStatusId = await _dbContext.SchAppointment
                    // .Where(x => x.VisitAccountNo == VisitAccountNo)
                    .Select(x => x.PatientStatusId)
                    .FirstOrDefaultAsync();

                if (PatientStatusId != 0) // Assuming 0 is not a valid PatientStatusId
                {
                    string PatientStatusValue = await _dbContext.SchPatientStatus
                        .Where(x => x.PatientStatusId == PatientStatusId)
                        .Select(x => x.PatientStatus)
                        .FirstOrDefaultAsync();

                    if (PatientStatusValue == "Checked-In")
                    {
                        // Check if the employee is allowed for Charge Capture
                        bool EmployeeAllowedChgCap = await IsEmployeeAllowedToMakeChargeCaptureAsync(EmployeeId);

                        if (EmployeeAllowedChgCap)
                        {
                            // Check if the appointment date is within 10 days of today's date
                            DateTime AppointmentDate = await _dbContext.SchAppointment
                                // .Where(x => x.VisitAccountNo == VisitAccountNo)
                                .Select(x => x.AppDateTime)
                                .FirstOrDefaultAsync();

                            if (IsAppointmentWithin10Days(AppointmentDate))
                            {
                                // Check if any diagnosis requires YearOfOnSet
                                var diagnosesWithYearOfOnSetRequired = Diagnoses.Where(diag => diag.Type == "PRIMARY" && RequiresYearOfOnSet(diag.Icd9code)).ToList();

                                if (diagnosesWithYearOfOnSetRequired.Count > 0)
                                {
                                    string icd9Codes = string.Join(", ", diagnosesWithYearOfOnSetRequired.Select(diag => diag.Icd9code));
                                    ErrorMessage = $"Kindly provide Year of Onset for the following Diagnosis: {icd9Codes}.";
                                }
                                else
                                {
                                    ErrorMessage = "Charge capturing is allowed for this patient.";
                                }
                            }
                            else
                            {
                                ErrorMessage = "Charge capturing only allowed within 10 days of appointment.";
                            }
                        }
                        else
                        {
                            ErrorMessage = "Employee is not allowed for Charge Capture.";
                        }
                    }
                    else
                    {
                        ErrorMessage = "Charge Capture only allowed for Checked-In patients.";
                    }
                }
                else
                {
                    ErrorMessage = "Appointment not found for the given VisitAccountNumber.";
                }

                return ErrorMessage;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        private async Task<bool> IsEmployeeAllowedToMakeChargeCaptureAsync(long EmployeeId)
        {
            // Check if the employee is allowed to make charge capture
            bool EmployeeAllowedChgCap = (bool)await _dbContext.Hremployee
                .Where(e => e.EmployeeId == EmployeeId)
                .Select(e => e.AllowChgCap)
                .FirstOrDefaultAsync();

            return EmployeeAllowedChgCap;
        }

        private bool IsAppointmentWithin10Days(DateTime appointmentDate)
        {
            DateTime today = DateTime.Today;
            TimeSpan difference = appointmentDate - today;
            return difference.TotalDays <= 10;
        }

        private bool RequiresYearOfOnSet(string icd9Code)
        {
            // Check if the diagnosis requires YearOfOnSet by querying BLMasterICD9CM
            bool isOnsetDx = (bool)_dbContext.BlmasterIcd9cm.Where(x => x.Icd9code == icd9Code).Select(x => x.IsOnsetDx).FirstOrDefault();

            return isOnsetDx;
        }


        public async Task<List<Blcptgroup>> GetCPTByProvider(long? Id)
        {
            var result = new Blcptgroup();
            var DbData = await Task.Run(() => _dbContext.Blcptgroup.Where(x => x.ProviderId == Id).OrderByDescending(x => x.GroupId).ToListAsync());

            return DbData;
        }

        public async Task<DataSet> CC_LoadAllGroupsAndCodes(long? GroupId, long? ProviderId, long? PayerId)
        {
            try
            {
                // Common DataSet
                DataSet finalDataSet = new DataSet();

                // First SP call (Groups)
                DynamicParameters param1 = new DynamicParameters();
                param1.Add("@ProviderId", ProviderId);
                param1.Add("@GroupId", GroupId);

                DataSet ds1 = await DapperHelper.GetDataSetBySPWithParams("BLHCPCSGroupGet", param1);

                if (ds1.Tables.Count == 0 || ds1.Tables[0].Rows.Count == 0)
                    throw new Exception("No group data found");

                ds1.Tables[0].TableName = "Groups";
                finalDataSet.Merge(ds1.Tables[0]);

                // Second SP call (Codes)
                DynamicParameters param2 = new DynamicParameters();
                param2.Add("@ProviderId", ProviderId);
                param2.Add("@GroupId", GroupId);
                param2.Add("@PayerId", PayerId);

                DataSet ds2 = await DapperHelper.GetDataSetBySPWithParams("BLHCPCSGroupCodeGet", param2);

                if (ds2.Tables.Count == 0 || ds2.Tables[0].Rows.Count == 0)
                    throw new Exception("No code data found");

                ds2.Tables[0].TableName = "Codes";
                finalDataSet.Merge(ds2.Tables[0]);

                return finalDataSet;
            }
            catch (Exception ex)
            {
                // Optionally log ex.Message
                return new DataSet();
            }
        }


        public async Task<DataSet> GetAllChargeCaptureDiagnosis(long? AppointmentId, int? pageNumber, int? pageSize)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                    param.Add("@AppointmentId", AppointmentId); 
                    param.Add("@PageNumber", pageNumber);
                    param.Add("@PageSize", pageSize);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("ChargeCaptureDiagnosis", param);

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

        public async Task<DataSet> GetAllChargeCaptureService(long? AppointmentId, int? pageNumber, int? pageSize)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@AppointmentId", AppointmentId);
                param.Add("@PageNumber", pageNumber);
                param.Add("@PageSize", pageSize);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("ChargeCaptureService", param);

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

    }

}
