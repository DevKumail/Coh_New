using Dapper;
using HMIS.Infrastructure.ORM;
using HMIS.Infrastructure.Repository;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using HMIS.Core.Entities;
using Task = System.Threading.Tasks.Task;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using HMIS.Application.Implementations;
using HMIS.Application.DTOs.ChargeCaptureDTOs;
using HMIS.Infrastructure.Helpers;
using Emgu.CV.Ocl;

namespace HMIS.Application.ServiceLogics
{
    public class ChargeCaptureManager : GenericRepositoryAsync<BlsuperBillDiagnosis>, IChargeCaptureManager
    {
        private readonly IMapper _mapper;
        private readonly HmisContext _dbContext;
        public ChargeCaptureManager(IMapper mapper, HmisContext dbContext) : base(dbContext)
        {
            this._mapper = mapper;
            _dbContext = dbContext;
        }



        public async Task<DataSet> CC_MyCptCodeGetDB(long ProviderId, long? GroupId, long? PayerId)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@ProviderId", ProviderId);

                param.Add("@GroupId", GroupId);

                param.Add("@PayerId", PayerId);


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

        public async Task<DataSet> CC_MyDiagnosisCodeDB(long ProviderId, long? GroupId, long? ICDVersionId)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@ProviderId", ProviderId);

                param.Add("@GroupId", GroupId);

                param.Add("@ICDVersionId", ICDVersionId);


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

        public async Task<DataSet> CC_DiagnosisCodeDB(int ICDVersionId, string DiagnosisStartCode, string DiagnosisEndCode, string DescriptionFilter)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@ICDVersionId", ICDVersionId);
                param.Add("@DiagnosisStartCode", DiagnosisStartCode);
                param.Add("@DiagnosisEndCode", DiagnosisEndCode);
                param.Add("@DescriptionFilter", DescriptionFilter);

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

        public async Task<DataSet> CC_CPTCodeDB(int? AllCPTCode, string CPTStartCode, string CPTEndCode, string Description)
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

        public async Task<DataSet> CC_MyDentalCodeDB(long ProviderId, long? GroupId, string ProviderDescription, string DentalCode, long? PayerId)
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
        public async Task<DataSet> CC_DentalCodeDB(int? AllDentalCode, string DentalStartCode, string DentalEndCode, string DescriptionFilter)
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

        public async Task<DataSet> CC_MyHCPCSCodeDB(long ProviderId, long? GroupId, string HCPCSCode, string DescriptionFilter, long? PayerId)
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

        public async Task<DataSet> CC_HCPCSCodeDB(int? AllHCPCSCode, string HCPCStartCode, string HCPCSEndCode, string DescriptionFilter)
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

        public async Task<DataSet> CC_UnclassifiedServiceDB(int? AllCode, string UCStartCode, string DescriptionFilter)
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

        public async Task<DataSet> CC_ServiceItemsDB(int? AllCode, string ServiceStartCode, string DescriptionFilter)
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
            var DbData = await Task.Run(() => _dbContext.Blicd9cmgroups.Where(x => x.ProviderId == Id).OrderByDescending(x => x.GroupId).ToListAsync());

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
        //    //return "";
        //}


        public async Task<String> SaveChargeCapture(ChargCaptureModel input)
        {
            try
            {
                List<BlSuperBillProcedureModel> blSuperBillProcedures = _mapper.Map<List<BlSuperBillProcedureModel>>(input.blSuperBillProcedureModel);

                List<BLSupperBillDiagnosisModel> bLSupperBillDiagnosis = _mapper.Map<List<BLSupperBillDiagnosisModel>>(input.BLSupperBillDiagnosisModel);

                var updateComment = _dbContext.SchAppointments.SingleOrDefault(e => e.AppId == input.AppointmentId);

                if (blSuperBillProcedures.Count > 0)
                {
                    foreach (var BillProcedure in blSuperBillProcedures)
                    {
                        BlsuperBillProcedure bLSuperBill = new BlsuperBillProcedure
                        {
                            ProcedureType = BillProcedure.ProcedureType,
                            ProcedureCode = BillProcedure.ProcedureCode,
                            Description = BillProcedure.Description,
                            ToothCode= BillProcedure.ToothCode,
                            Units= BillProcedure.Units,
                            Modifier1= BillProcedure.Modifier1,
                            Modifier2= BillProcedure.Modifier2,
                            Modifier3= BillProcedure.Modifier3,
                            Modifier4= BillProcedure.Modifier4
                        };

                        _dbContext.BlsuperBillProcedures.Add(bLSuperBill);

                        if (BillProcedure.ProcedureType == "CPT")
                        {
                            var getCptId = _dbContext.ProcedureTypes.Where(x=>x.Type == BillProcedure.ProcedureType).FirstOrDefault().Id;
                            PatientProcedure patientProcedure = new PatientProcedure()
                            {
                                ProviderId = Convert.ToInt64(BillProcedure.CreatedBy),
                                Cptcode = BillProcedure.ProcedureType,
                                ProcedureDescription = BillProcedure.Description,
                                ProcedureDateTime = System.DateTime.UtcNow,
                                ProcedureType = getCptId,
                                Active = 1,
                                ProcedurePriority = BillProcedure.ProcedurePriority,
                                AssociatedDiagnosisCode= BillProcedure.AssociatedDiagnosisCode,
                                PrimaryAnestheticId=BillProcedure.PrimaryAnestheticId.ToString(),
                                TypeOfAnesthesia=BillProcedure.TypeOfAnesthesia,
                                AnesthesiaStartDateTime= BillProcedure.AnesthesiaStartDateTime,
                                AnesthesiaEndDateTime = BillProcedure.AnesthesiaEndDateTime,
                                PerformedOnFacility = true,
                                IsHl7msgCreated=BillProcedure.IsHl7msgCreated,
                                IsLabTest = BillProcedure.IsLabTest

                            };
                            _dbContext.PatientProcedures.Add(patientProcedure);
                        }
                    }
                    if (updateComment != null)
                    {
                        updateComment.ChargeCaptureComments = input.Comment;
                    }
                    await _dbContext.SaveChangesAsync();
                    return "OK";
                }
                if (bLSupperBillDiagnosis.Count > 0)
                {
                    foreach (var Diagnosis in bLSupperBillDiagnosis)
                    {
                        // Call ValidateChargeCapture with a list containing the current diagnosis
                        //var message = await ValidateChargeCapture(new List<BlsuperBillDiagnosis> { Diagnosis }, input.VisitAccountNo, input.EmployeeId);

                        //_dbContext.BlsuperBillDiagnoses.Add(Diagnosis);
                        var EmpName = _dbContext.Hremployees.Where(x => x.EmployeeId == Convert.ToInt64(Diagnosis.CreatedBy)).FirstOrDefault().FullName;

                        BlsuperBillDiagnosis blsuperBillDiagnosis = new BlsuperBillDiagnosis()
                        {
                            CreatedBy = EmpName,
                            CreatedDate = Diagnosis.CreatedDate,
                            Descriptionshort = Diagnosis.Descriptionshort,
                            DiagnosisPriority = Diagnosis.DiagnosisPriority,
                            DiagnosisType = Diagnosis.DiagnosisType,
                            Icd9code = Diagnosis.Icd9code,
                            Icdorder= Diagnosis.Icdorder,
                            IcdversionId= Diagnosis.IcdversionId,
                            IsHl7msgCreated= Diagnosis.IsHl7msgCreated,
                            Type= Diagnosis.Type,
                            YearofOnset= Diagnosis.YearofOnset,
                            LastUpdatedBy= EmpName,
                            LastUpdatedDate = Diagnosis.LastUpdatedDate
                        };
                        _dbContext.BlsuperBillDiagnoses.Add(blsuperBillDiagnosis);
                    }
                    await _dbContext.SaveChangesAsync();
                    return "OK";
                }

                return null;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }

            //    List<BlsuperBillDiagnosis> bLSupperBillDiagnosis = _mapper.Map<List<BlsuperBillDiagnosis>>(input.BLSupperBillDiagnosisModel);


            //    BlsuperBillProcedure? blsuperBillProcedure = await Task.Run(() => _dbContext.BlsuperBillProcedures.Where(x => x.AppointmentId == input.VisitAccountNo).FirstOrDefaultAsync());
            //    //BlpatientVisit? blpatientVisitTab = await Task.Run(() => _dbContext.SchAppointments.Where(x => x.VisitAccountNo == input.VisitAccountNo).FirstOrDefaultAsync());
            //    SchAppointment? SchAppointmentTab = await Task.Run(() => _dbContext.SchAppointments.Where(x => x.VisitAccountNo == input.VisitAccountNo)
            //    .FirstOrDefaultAsync());

            //    BlsuperBillDiagnosis? blsuperBillDiagnosisTab = _dbContext.BlsuperBillDiagnoses.Where(x => x.AppointmentId == input.BLSupperBillDiagnosisModel[0].VisitAccountNo).FirstOrDefault();

            //    foreach (var Diagnosis in bLSupperBillDiagnosis)
            //    {
            //        // Call ValidateChargeCapture with a list containing the current diagnosis
            //        var message = await ValidateChargeCapture(new List<BlsuperBillDiagnosis> { Diagnosis }, input.VisitAccountNo, input.EmployeeId);

            //        _dbContext.BlsuperBillDiagnoses.Add(Diagnosis);
            //    }

            //    _dbContext.BlsuperBillProcedures.Add(blsuperBillProcedure);

            //    return "";



            //}
            //catch (Exception ex)
            //{
            //    return ex.ToString();
            //}
        }



        public async Task<string> ValidateChargeCapture(List<BlsuperBillDiagnosis> Diagnoses, long VisitAccountNo, long EmployeeId)
        {
            try
            {
                // Declare variables to hold the error message and employee status
                string ErrorMessage = "";

                // Check if an invoice is already generated for the visit
                int InvoiceGeneratedCount = await _dbContext.SchAppointments
                    .Where(x => x.VisitAccountNo == VisitAccountNo && x.IsInvoiceGenerated == true)
                    .CountAsync();

                if (InvoiceGeneratedCount > 0)
                {
                    ErrorMessage = "Invoice for this visit is already generated.";
                    return ErrorMessage;
                }

                // Check if patient status is Checked-In
                int PatientStatusId = await _dbContext.SchAppointments
                   // .Where(x => x.VisitAccountNo == VisitAccountNo)
                    .Select(x => x.PatientStatusId)
                    .FirstOrDefaultAsync();

                if (PatientStatusId != 0) // Assuming 0 is not a valid PatientStatusId
                {
                    string PatientStatusValue = await _dbContext.SchPatientStatuses
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
                            DateTime AppointmentDate = await _dbContext.SchAppointments
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
            bool EmployeeAllowedChgCap = (bool)await _dbContext.Hremployees
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
            bool isOnsetDx = (bool)_dbContext.BlmasterIcd9cms.Where(x => x.Icd9code == icd9Code).Select(x => x.IsOnsetDx).FirstOrDefault();

            return isOnsetDx;
        }


        public async Task<List<Blcptgroup>> GetCPTByProvider(long? Id)
        {
            var result = new Blcptgroup();
            var DbData = await Task.Run(() => _dbContext.Blcptgroups.Where(x => x.ProviderId == Id).OrderByDescending(x => x.GroupId).ToListAsync());

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


    }
}
