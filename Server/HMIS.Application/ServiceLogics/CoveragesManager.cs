using Dapper;
using GdPicture14;
using HMIS.Infrastructure.Helpers;
using HMIS.Infrastructure.ORM;
using HMIS.Core.Entities;
using HMIS.Infrastructure.Repository;
using HMIS.Application.DTOs;
using HMIS.Application.DTOs.Coverage;
using HMIS.Application.Implementations;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Data.SqlTypes;
using System.Globalization;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Task = System.Threading.Tasks.Task;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using HMIS.Infrastructure.Helpers;
using Microsoft.AspNetCore.Mvc;
using HMIS.Application.DTOs.SpLocalModel;
using Azure.Core;
using Emgu.CV.OCR;
using Emgu.CV.Structure;
using Emgu.CV;
using System.Text.RegularExpressions;
using static System.Net.Mime.MediaTypeNames;

namespace HMIS.Application.ServiceLogics
{
    public class CoveragesManager : ICoveragesManager
    {
        public IConfiguration Configuration { get; }
        private readonly HmisContext _context;
        //public CoveragesManager(IConfiguration configuration)
        //{
        //    Configuration = configuration;
        //}
        public CoveragesManager(HmisContext context, IConfiguration configuration)
        {
            _context = context;
            Configuration = configuration;
        }
        public async Task<DataSet> GetCoveragesList(CoverageList req)
        {
            try
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@MRNo", req.CoverageListReq.Mrno);
                parameters.Add("@Page", req.PaginationInfo.Page, DbType.Int32);
                parameters.Add("@PageSize", req.PaginationInfo.RowsPerPage, DbType.Int32);

                //param.Add("@Type", type.HasValue ? type.Value : -1, DbType.Int32);
                //param.Add("@Name", string.IsNullOrEmpty(name) ? null : name, DbType.String);
                //param.Add("@InsuranceID", string.IsNullOrEmpty(insuranceId) ? null : insuranceId, DbType.String);

                DataSet ds = await DapperHelper.GetDataSetBySP("CoverageListGetAll", parameters);
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
        public async Task<DataSet> GetSearchDB(Byte? CompanyOrIndividual, string? LastName, string? SSN, string? InsuredIDNo, string? MRNo, int PageNumber, int PageSize)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@CompanyOrIndividual", CompanyOrIndividual, DbType.Int16);
                param.Add("@LastName", LastName, DbType.String);
                param.Add("@SSN", SSN, DbType.String);
                param.Add("@InsuredIDNo", InsuredIDNo, DbType.String);
                param.Add("@MRNo", MRNo, DbType.String);
                param.Add("@PageNumber", PageNumber, DbType.Int32);
                param.Add("@PageSize", PageSize, DbType.Int32);


                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("REG_InsuredSubscriberGet", param);
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

        public async Task<DataSet> GetBLEligibilityLogsDB(string? MRNo, long? VisitAccountNo, int? EligibilityId, int? ELStatusId, string? MessageRequestDate, string? MessageResponseDate)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@MRNo", MRNo);
                param.Add("@VisitAccountNo", VisitAccountNo);
                param.Add("@EligibilityId", EligibilityId);
                param.Add("@ELStatusId", ELStatusId);
                param.Add("@MessageRequestDate", MessageRequestDate);
                param.Add("@MessageResponseDate", MessageResponseDate);



                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("REG_GetBLEligibilityLogs", param);
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

        public async Task<DataSet> GetSubcriberDetailsDB(string InsuredIDNo)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@InsuredIDNo", InsuredIDNo, DbType.String);
                param.Add("@SubscriberId", SqlDbType.BigInt, (DbType?)ParameterDirection.Output);



                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("REG_GetInsuredSubscriberDetail", param);
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

        public async Task<DataSet> GetCoverageDB(long subscribedId)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();

                param.Add("@SubscribedId", subscribedId, DbType.Int64);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("REG_GetCoveragesById", param);
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

        //public async Task<string> InsertSubscriberDB(InsuranceSubscriber regInsert)
        //{
        //    try

        //    {
        //        DataTable RegInsurancePolicyDT = ConversionHelper.ToDataTable(regInsert.regInsurancePolicy);

        //        DataTable RegDeductDT = ConversionHelper.ToDataTable(regInsert.regDeduct);


        //        DynamicParameters parameters = new DynamicParameters();

        //        //   parameters.Add("@SubscriberId", SqlDbType.BigInt, (DbType?)ParameterDirection.Output);

        //        parameters.Add("@CarrierId", regInsert.CarrierId, DbType.Int32);
        //        parameters.Add("@InsuredIDNo", regInsert.InsuredIDNo, DbType.String);
        //        parameters.Add("@InsuredGroupOrPolicyNo", regInsert.InsuredGroupOrPolicyNo, DbType.String);
        //        parameters.Add("@InsuredGroupOrPolicyName", regInsert.InsuredGroupOrPolicyName, DbType.String);
        //        parameters.Add("@CompanyOrIndividual", regInsert.CompanyOrIndividual, DbType.Byte);
        //        parameters.Add("@Copay", regInsert.Copay, DbType.Decimal);
        //        parameters.Add("@Suffix", regInsert.Suffix, DbType.String);
        //        parameters.Add("@FirstName", regInsert.FirstName, DbType.String);
        //        parameters.Add("@MiddleName", regInsert.MiddleName, DbType.String);
        //        parameters.Add("@LastName", regInsert.LastName, DbType.String);
        //        parameters.Add("@BirthDate", regInsert.BirthDate, DbType.DateTime);
        //        parameters.Add("@Sex", regInsert.Sex, DbType.String);
        //        parameters.Add("@InsuredPhone", regInsert.InsuredPhone, DbType.String);
        //        parameters.Add("@OtherPhone", regInsert.OtherPhone, DbType.String);
        //        parameters.Add("@Address1", regInsert.Address1, DbType.String);
        //        parameters.Add("@Address2", regInsert.Address2, DbType.String);
        //        parameters.Add("@ZipCode", regInsert.ZipCode, DbType.String);
        //        parameters.Add("@CityId", regInsert.CityId, DbType.Int32);
        //        parameters.Add("@StateId", regInsert.StateId, DbType.Int32);
        //        parameters.Add("@CountryId", regInsert.CountryId, DbType.Int32);
        //        parameters.Add("@Inactive", regInsert.Inactive, DbType.Boolean);
        //        parameters.Add("@EnteredBy", regInsert.EnteredBy, DbType.String);
        //        parameters.Add("@Verified", regInsert.Verified, DbType.Boolean);
        //        parameters.Add("@ChkDeductible", regInsert.ChkDeductible, DbType.Boolean);
        //        parameters.Add("@Deductibles", regInsert.Deductibles, DbType.Decimal, ParameterDirection.Input);
        //        parameters.Add("@DNDeductible", regInsert.DNDeductible, DbType.Decimal, ParameterDirection.Input);
        //        parameters.Add("@OpCopay", regInsert.OpCopay, DbType.Decimal, ParameterDirection.Input);

        //        parameters.Add("@MRNo", regInsert.MRNo, DbType.String);
        //        parameters.Add("@CoverageOrder", regInsert.CoverageOrder, DbType.Byte);
        //        parameters.Add("@IsSelected", regInsert.IsSelected, DbType.Boolean);


        //        parameters.Add("@RegInsurancePolicyTypeVar", RegInsurancePolicyDT, DbType.Object);
        //        parameters.Add("@RegDeductTypeVar", RegDeductDT, DbType.Object);




        //        bool res = await DapperHelper.ExcecuteSPByParams("REG_InsuredSubscriberInsert", parameters);

        //        if (res == true)
        //        {
        //            return "OK";
        //        }

        //        return string.Empty;
        //    }
        //    catch (Exception ex)
        //    {

        //        return (ex.Message);
        //    }
        //}


        private DateTime? GetValidDate(string dateStr)
        {
            DateTime validDate;
            if (DateTime.TryParseExact(dateStr, "yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture, DateTimeStyles.None, out validDate))
            {
                // Check if the date is within the valid range for SQL Server DateTime.
                if (validDate >= SqlDateTime.MinValue.Value && validDate <= SqlDateTime.MaxValue.Value)
                {
                    return validDate;
                }
            }

            // Return null for any invalid or out-of-range date.
            return null;
        }
        public async Task<string> InsertSubscriberDB(InsuranceSubscriber regInsert)
        {
            try
            {
                InsuredSubscriber insuredSubscriber = new InsuredSubscriber()
                {
                    SubscriberId = 0,
                    CarrierId = regInsert.CarrierId,
                    InsuredIdno = regInsert.InsuredIDNo,
                    InsuredGroupOrPolicyNo = regInsert.InsuredGroupOrPolicyName,
                    InsuredGroupOrPolicyName = regInsert.InsuredGroupOrPolicyName,
                    CompanyOrIndividual = regInsert.CompanyOrIndividual,
                    Copay = regInsert.Copay,
                    Suffix = regInsert.Suffix,
                    FirstName = regInsert.FirstName,
                    LastName = regInsert.LastName,
                    BirthDate = regInsert.BirthDate,
                    Sex = regInsert.Sex,
                    InsuredPhone = regInsert.InsuredPhone,
                    OtherPhone = regInsert.OtherPhone,
                    Address1 = regInsert.Address1,
                    Address2 = regInsert.Address2,
                    ZipCode = regInsert.ZipCode,
                    CityId = regInsert.CityId,
                    StateId = regInsert.StateId,
                    CountryId = regInsert.CountryId,
                    Inactive = regInsert.Inactive,
                    EnteredBy = regInsert.EnteredBy,
                    Verified = regInsert.Verified,
                    ChkDeductibles = regInsert.ChkDeductible,
                    Deductibles = regInsert.Deductibles,
                    Dndeductible = regInsert.Deductibles,
                    Opcopay = regInsert.OpCopay,
                    Mrno = regInsert.MRNo,
                    CoverageOrder = regInsert.CoverageOrder,
                    IsSelected = regInsert.IsSelected,
                    EntryDate = DateTime.Now,
                    IsDeleted = false,
                };
                if (regInsert.regInsurancePolicy != null && regInsert.regInsurancePolicy.Count > 0)
                {
                    foreach (var item in regInsert.regInsurancePolicy)
                    {

                        Core.Entities.InsuredPolicy ip = new Core.Entities.InsuredPolicy()
                        {
                            IsDeleted = false,
                            EffectiveDate = item.EffectiveDate,
                            TerminationDate = item.TerminationDate,
                            GroupNo = item.GroupNo,
                            NoOfVisits = item.NoOfVisits,
                            Status = item.Status,
                            SubscriberId = item.SubscriberId,
                            Amount = item.Amount,
                        };
                        insuredSubscriber.InsuredPolicies.Add(ip);
                    }
                }
                if (regInsert.regDeduct != null && regInsert.regDeduct.Count > 0)
                {
                    foreach (var item in regInsert.regDeduct)
                    {
                        Core.Entities.DeductiblePercent dp = new Core.Entities.DeductiblePercent()
                        {
                            IsDeleted = false,
                            SubscriberId = item.SubscriberId,
                            ServiceType = item.ServiceType,
                            Deductible = item.Deductible,
                        };
                        insuredSubscriber.DeductiblePercents.Add(dp);
                    }
                }
                await _context.InsuredSubscribers.AddAsync(insuredSubscriber);
                await _context.SaveChangesAsync();
                return "OK";
                //DataTable RegInsurancePolicyDT = ConversionHelper.ToDataTable(regInsert.regInsurancePolicy);
                //DataTable RegDeductDT = ConversionHelper.ToDataTable(regInsert.regDeduct);
                //DynamicParameters parameters = new DynamicParameters();
                ////   parameters.Add("@SubscriberId", SqlDbType.BigInt, (DbType?)ParameterDirection.Output);
                //parameters.Add("@CarrierId", regInsert.CarrierId, DbType.Int32);
                //parameters.Add("@InsuredIDNo", regInsert.InsuredIDNo, DbType.String);
                //parameters.Add("@InsuredGroupOrPolicyNo", regInsert.InsuredGroupOrPolicyNo, DbType.String);
                //parameters.Add("@InsuredGroupOrPolicyName", regInsert.InsuredGroupOrPolicyName, DbType.String);
                //parameters.Add("@CompanyOrIndividual", regInsert.CompanyOrIndividual, DbType.Byte);
                //parameters.Add("@Copay", regInsert.Copay, DbType.Decimal);
                //parameters.Add("@Suffix", regInsert.Suffix, DbType.String);
                //parameters.Add("@FirstName", regInsert.FirstName, DbType.String);
                //parameters.Add("@MiddleName", regInsert.MiddleName, DbType.String);
                //parameters.Add("@LastName", regInsert.LastName, DbType.String);
                //parameters.Add("@BirthDate", regInsert.BirthDate, DbType.DateTime);
                //parameters.Add("@Sex", regInsert.Sex, DbType.String);
                //parameters.Add("@InsuredPhone", regInsert.InsuredPhone, DbType.String);
                //parameters.Add("@OtherPhone", regInsert.OtherPhone, DbType.String);
                //parameters.Add("@Address1", regInsert.Address1, DbType.String);
                //parameters.Add("@Address2", regInsert.Address2, DbType.String);
                //parameters.Add("@ZipCode", regInsert.ZipCode, DbType.String);
                //parameters.Add("@CityId", regInsert.CityId, DbType.Int32);
                //parameters.Add("@StateId", regInsert.StateId, DbType.Int32);
                //parameters.Add("@CountryId", regInsert.CountryId, DbType.Int32);
                //parameters.Add("@Inactive", regInsert.Inactive, DbType.Boolean);
                //parameters.Add("@EnteredBy", regInsert.EnteredBy, DbType.String);
                //parameters.Add("@Verified", regInsert.Verified, DbType.Boolean);
                //parameters.Add("@ChkDeductible", regInsert.ChkDeductible, DbType.Boolean);
                //parameters.Add("@Deductibles", regInsert.Deductibles, DbType.Decimal, ParameterDirection.Input);
                //parameters.Add("@DNDeductible", regInsert.DNDeductible, DbType.Decimal, ParameterDirection.Input);
                //parameters.Add("@OpCopay", regInsert.OpCopay, DbType.Decimal, ParameterDirection.Input);
                //parameters.Add("@MRNo", regInsert.MRNo, DbType.String);
                //parameters.Add("@CoverageOrder", regInsert.CoverageOrder, DbType.Byte);
                //parameters.Add("@IsSelected", regInsert.IsSelected, DbType.Boolean);
                //parameters.Add("@RegInsurancePolicyTypeVar", RegInsurancePolicyDT, DbType.Object);
                //parameters.Add("@RegDeductTypeVar", RegDeductDT, DbType.Object);
                //bool res = await DapperHelper.ExcecuteSPByParams("REG_InsuredSubscriberInsert", parameters);
                //return string.Empty;
            }
            catch (Exception ex)
            {
                return (ex.Message);
            }
        }

        //public async Task<string> UpdateSubscriberDB(InsuranceSubscriber regUpdate)
        //{
        //    try

        //    {
        //        DataTable RegInsurancePolicyDT = ConversionHelper.ToDataTable(regUpdate.regInsurancePolicy);

        //        DataTable RegDeductDT = ConversionHelper.ToDataTable(regUpdate.regDeduct);


        //        DynamicParameters parameters = new DynamicParameters();

        //        parameters.Add("@SubscriberId", regUpdate.SubscriberID, DbType.Int64);

        //        parameters.Add("@CarrierId", regUpdate.CarrierId, DbType.Int32);
        //        parameters.Add("@InsuredIDNo", regUpdate.InsuredIDNo, DbType.String);
        //        parameters.Add("@InsuredGroupOrPolicyNo", regUpdate.InsuredGroupOrPolicyNo, DbType.String);
        //        parameters.Add("@InsuredGroupOrPolicyName", regUpdate.InsuredGroupOrPolicyName, DbType.String);
        //        parameters.Add("@CompanyOrIndividual", regUpdate.CompanyOrIndividual, DbType.Byte);
        //        parameters.Add("@Copay", regUpdate.Copay, DbType.Decimal);
        //        parameters.Add("@Suffix", regUpdate.Suffix, DbType.String);
        //        parameters.Add("@FirstName", regUpdate.FirstName, DbType.String);
        //        parameters.Add("@MiddleName", regUpdate.MiddleName, DbType.String);
        //        parameters.Add("@LastName", regUpdate.LastName, DbType.String);
        //        parameters.Add("@BirthDate", regUpdate.BirthDate, DbType.DateTime);
        //        parameters.Add("@Sex", regUpdate.Sex, DbType.String);
        //        parameters.Add("@InsuredPhone", regUpdate.InsuredPhone, DbType.String);
        //        parameters.Add("@OtherPhone", regUpdate.OtherPhone, DbType.String);
        //        parameters.Add("@Address1", regUpdate.Address1, DbType.String);
        //        parameters.Add("@Address2", regUpdate.Address2, DbType.String);
        //        parameters.Add("@ZipCode", regUpdate.ZipCode, DbType.String);
        //        parameters.Add("@CityId", regUpdate.CityId, DbType.Int32);
        //        parameters.Add("@StateId", regUpdate.StateId, DbType.Int32);
        //        parameters.Add("@CountryId", regUpdate.CountryId, DbType.Int32);
        //        parameters.Add("@Inactive", regUpdate.Inactive, DbType.Boolean);
        //        parameters.Add("@EnteredBy", regUpdate.EnteredBy, DbType.String);
        //        parameters.Add("@Verified", regUpdate.Verified, DbType.Boolean);
        //        parameters.Add("@ChkDeductible", regUpdate.ChkDeductible, DbType.Boolean);
        //        parameters.Add("@Deductibles", regUpdate.Deductibles, DbType.Decimal, ParameterDirection.Input);
        //        parameters.Add("@DNDeductible", regUpdate.DNDeductible, DbType.Decimal, ParameterDirection.Input);
        //        parameters.Add("@OpCopay", regUpdate.OpCopay, DbType.Decimal, ParameterDirection.Input);
        //        parameters.Add("@MRNo", regUpdate.MRNo, DbType.String);
        //        parameters.Add("@CoverageOrder", regUpdate.CoverageOrder, DbType.Byte);
        //        parameters.Add("@IsSelected", regUpdate.IsSelected, DbType.Boolean);

        //        parameters.Add("@RegInsurancePolicyTypeVar", RegInsurancePolicyDT, DbType.Object);
        //        parameters.Add("@RegDeductTypeVar", RegDeductDT, DbType.Object);




        //        bool res = await DapperHelper.ExcecuteSPByParams("REG_InsuredSubscriberUpdate", parameters);

        //        if (res == true)
        //        {
        //            return "OK";
        //        }

        //        return string.Empty;
        //    }
        //    catch (Exception ex)
        //    {

        //        return (ex.Message);
        //    }
        //}

        public async Task<InsurenceEligibility> ReadImage(IFormFile imageFile, long PayerId)
        {
            try
            {
                string connectionString = Configuration.GetConnectionString("DefaultConnection");
                var tempFilePath = Path.GetTempFileName();
                using (var fileStream = new FileStream(tempFilePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(fileStream);
                }

                byte[] imageData;
                using (var memoryStream = new MemoryStream())
                {
                    await imageFile.CopyToAsync(memoryStream);
                    imageData = memoryStream.ToArray();
                }

                string extractedText;
                try
                {
                    using (var img = new Emgu.CV.Image<Bgr, byte>(tempFilePath))
                    using (var ocr = new Tesseract(@"E:\HMIS_2-5-2024\tesseract-main\tesseract-main\tesseract-main\tessdata", "eng", OcrEngineMode.Default))
                    {
                        ocr.SetImage(img);
                        ocr.Recognize();
                        extractedText = ocr.GetUTF8Text();
                    }
                }
                catch (DllNotFoundException ex)
                {
                    throw new Exception("Ensure that all required native libraries for Emgu.CV are present and properly configured.", ex);
                }

                var keyValueData = ExtractKeyValueData(extractedText);

                InsurenceEligibility model = new InsurenceEligibility();

                List<string> ColumnsValues = new List<string>();
                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    ColumnsValues = await GetColumnsValuesAsync(connection);
                    await connection.CloseAsync();
                }

                foreach (var item in keyValueData)
                {
                    using (var connection = new SqlConnection(connectionString))
                    {
                        var chkCardFieldName = await Task.Run(() => GetInternalFieldName(connection, PayerId, item.Key));
                        if (chkCardFieldName != null)
                        {
                            UpdateModelBasedOnField(model, chkCardFieldName, item.Value, ColumnsValues, imageData);
                        }
                    }
                }

                model.BlPayerId = Convert.ToInt32(PayerId);

                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    string insertQuery = "INSERT INTO InsuranceEligibility (PatientName, InsuranceMemberID, EffectiveDate, ExpiryDate, Image, PolicyNumber, BlPayerId, PackageName, PackageID, CreatedBy, CreatedOn) " +
                                         "VALUES (@PatientName, @InsuranceMemberID, @EffectiveDate, @ExpiryDate, @Image, @PolicyNumber, @BlPayerId, @PackageName, @PackageID, @CreatedBy, @CreatedOn)";
                    using (var command = new SqlCommand(insertQuery, connection))
                    {
                        AddSqlParameters(command, model);

                        int rowsAffected = await command.ExecuteNonQueryAsync();
                        if (rowsAffected == 1)
                        {
                            return model;
                        }
                        else
                        {
                            model.Message = "Not Inserted";
                            return model;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static Dictionary<string, string> ExtractKeyValueData(string extractedText)
        {
            var keyValueData = new Dictionary<string, string>();
            var lines = extractedText.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);

            foreach (var line in lines)
            {
                if (line.Contains("Name:"))
                {
                    keyValueData["Name"] = ExtractValue(line, "Name:");
                }
                else if (line.Contains("D.0.B:"))
                {
                    keyValueData["D.O.B"] = ExtractValue(line, "D.0.B:");
                }
                else if (line.Contains("DNo:"))
                {
                    keyValueData["DNo"] = ExtractValue(line, "DNo:");
                }
                else if (line.Contains("Issued:"))
                {
                    keyValueData["Issued"] = ExtractValue(line, "Issued:");
                }
                else if (line.Contains("Expires:"))
                {
                    keyValueData["Expires"] = ExtractValue(line, "Expires:");
                }
                // Add more parsing logic as needed
            }

            return keyValueData;
        }
        private static string ExtractValue(string line, string key)
        {
            return line.Substring(line.IndexOf(key) + key.Length).Trim(' ', '|', '[');
        }
        private static void UpdateModelBasedOnField(InsurenceEligibility model, string fieldName, string value, List<string> ColumnsValues, byte[] imageData)
        {
            bool InsuranceMemberID = ColumnsValues.Any(x => x.Contains("InsuranceMemberID") && x == fieldName);
            bool ExpiryDate = ColumnsValues.Any(x => x.Contains("ExpiryDate") && x == fieldName);
            bool PatientName = ColumnsValues.Any(x => x.Contains("PatientName") && x == fieldName);
            bool EffectiveDate = ColumnsValues.Any(x => x.Contains("EffectiveDate") && x == fieldName);
            bool PackageName = ColumnsValues.Any(x => x.Contains("PackageName") && x == fieldName);
            bool PolicyNumber = ColumnsValues.Any(x => x.Contains("PolicyNumber") && x == fieldName);
            bool PackageID = ColumnsValues.Any(x => x.Contains("PackageID") && x == fieldName);

            if (InsuranceMemberID)
            {
                model.InsuranceMemberID = value;
                model.VisitAccountNo = 92638;
                model.Image = imageData;
                model.CreatedOn = DateTime.Now.ToString("yyyyMMddHHmmss");
                model.CreatedBy = "System";
            }
            else if (ExpiryDate)
            {
                model.ExpiryDate = Convert.ToDateTime(value);
            }
            else if (PatientName)
            {
                model.PatientName = value;
            }
            else if (EffectiveDate)
            {
                model.EffectiveDate = Convert.ToDateTime(value);
            }
            else if (PackageName)
            {
                model.PackageName = value;
            }
            else if (PolicyNumber)
            {
                model.PolicyNumber = value;
            }
            else if (PackageID)
            {
                model.PackageId = Convert.ToInt32(value);
            }
        }

        private static void AddSqlParameters(SqlCommand command, InsurenceEligibility model)
        {
            command.Parameters.AddWithValue("@VisitAccountNo", 92638);
            command.Parameters.AddWithValue("@PatientName", (object)model.PatientName ?? DBNull.Value);
            command.Parameters.AddWithValue("@InsuranceMemberID", (object)model.InsuranceMemberID ?? DBNull.Value);
            command.Parameters.AddWithValue("@EffectiveDate", (object)model.EffectiveDate ?? DBNull.Value);
            command.Parameters.AddWithValue("@ExpiryDate", (object)model.ExpiryDate ?? DBNull.Value);
            command.Parameters.AddWithValue("@Image", (object)model.Image ?? DBNull.Value);
            command.Parameters.AddWithValue("@PolicyNumber", (object)model.PolicyNumber ?? DBNull.Value);
            command.Parameters.AddWithValue("@BlPayerId", model.BlPayerId);
            command.Parameters.AddWithValue("@PackageName", (object)model.PackageName ?? DBNull.Value);
            command.Parameters.AddWithValue("@PackageID", (object)model.PackageId ?? DBNull.Value);
            command.Parameters.AddWithValue("@CreatedBy", model.CreatedBy);
            command.Parameters.AddWithValue("@CreatedOn", model.CreatedOn);
        }


        //public async Task<InsurenceEligibility> ReadImage(IFormFile imageFile, long PayerId)
        //{
        //    try

        //    {

        //        //string connectionString = "Server=51.79.209.55;Initial Catalog=CohrentUpgrade;user id=cohrentupgrade;password=cohrentupgrade;Encrypt=True;TrustServerCertificate=True;";
        //        string connectionString = Configuration.GetConnectionString("DefaultConnection");//"Server=51.79.209.55;Initial Catalog=CohrentUpgrade;user id=cohrentupgrade;password=cohrentupgrade;Encrypt=True;TrustServerCertificate=True;";
        //        var tempFilePath = Path.GetTempFileName();
        //        using (var fileStream = new FileStream(tempFilePath, FileMode.Create))
        //        {
        //            imageFile.CopyTo(fileStream);
        //        }
        //        byte[] imageData;
        //        using (MemoryStream memoryStream = new MemoryStream())
        //        {
        //            imageFile.CopyTo(memoryStream);
        //            imageData = memoryStream.ToArray();
        //        }
        //        using (GdPictureOCR gdpictureOCR = new GdPictureOCR())
        //        using (GdPictureImaging gdpictureImaging = new GdPictureImaging())
        //        {
        //            int imageId = gdpictureImaging.CreateGdPictureImageFromFile(tempFilePath);
        //            gdpictureOCR.ResourceFolder = Configuration.GetValue<string>("GdPicture");
        //            gdpictureOCR.AddLanguage(OCRLanguage.English);
        //            gdpictureOCR.SetImage(imageId);
        //            string ocrResultId = gdpictureOCR.RunOCR();
        //            Dictionary<string, string> keyValueData = new Dictionary<string, string>();
        //            for (int pairIndex = 0; pairIndex < gdpictureOCR.GetKeyValuePairCount(ocrResultId); pairIndex++)
        //            {
        //                string key = gdpictureOCR.GetKeyValuePairKeyString(ocrResultId, pairIndex);
        //                string value = gdpictureOCR.GetKeyValuePairValueString(ocrResultId, pairIndex);

        //                keyValueData[key] = value;
        //            }

        //            InsurenceEligibility model = new InsurenceEligibility();

        //            List<string> ColumnsValues = new List<string>();
        //            using (SqlConnection connection = new SqlConnection(connectionString))
        //            {
        //                await connection.OpenAsync();
        //                ColumnsValues = await GetColumnsValuesAsync(connection);
        //                await connection.CloseAsync();
        //            }
        //            foreach (var item in keyValueData)
        //            {
        //                using (SqlConnection connection = new SqlConnection(connectionString))
        //                {
        //                    var chkCardFieldName = await Task.Run(() => GetInternalFieldName(connection, PayerId, item.Key));
        //                    if (chkCardFieldName != null)
        //                    {
        //                        bool InsuranceMemberID = ColumnsValues.Any(x => x.Contains("InsuranceMemberID") && x == chkCardFieldName);
        //                        bool ExpiryDate = ColumnsValues.Any(x => x.Contains("ExpiryDate") && x == chkCardFieldName);
        //                        bool PatientName = ColumnsValues.Any(x => x.Contains("PatientName") && x == chkCardFieldName);
        //                        bool EffectiveDate = ColumnsValues.Any(x => x.Contains("EffectiveDate") && x == chkCardFieldName);
        //                        bool PackageName = ColumnsValues.Any(x => x.Contains("PackageName") && x == chkCardFieldName);
        //                        bool PolicyNumber = ColumnsValues.Any(x => x.Contains("PolicyNumber") && x == chkCardFieldName);
        //                        bool PackageID = ColumnsValues.Any(x => x.Contains("PackageID") && x == chkCardFieldName);

        //                        if (InsuranceMemberID)
        //                        {
        //                            model.InsuranceMemberID = item.Value;
        //                            model.VisitAccountNo = 92638;
        //                            model.Image = imageData;
        //                            model.CreatedOn = DateTime.Now.ToString("yyyyMMddHHmmss");

        //                            model.CreatedBy = "System";

        //                        }
        //                        else if (ExpiryDate)
        //                        {
        //                            model.ExpiryDate = Convert.ToDateTime(item.Value);
        //                        }
        //                        else if (PatientName)
        //                        {
        //                            model.PatientName = item.Value;
        //                        }
        //                        else if (EffectiveDate)
        //                        {
        //                            model.EffectiveDate = Convert.ToDateTime(item.Value);
        //                        }
        //                        else if (PackageName)
        //                        {
        //                            model.PackageName = item.Value;
        //                        }
        //                        else if (PolicyNumber)
        //                        {
        //                            model.PolicyNumber = item.Value;
        //                        }
        //                        else if (PackageID)
        //                        {
        //                            model.PackageId = Convert.ToInt32(item.Value);
        //                        }

        //                    }

        //                    //else
        //                    //{
        //                    //    model.Message = "Mapping Not Found";
        //                    //    return model;
        //                    //}
        //                }

        //            }
        //            model.BlPayerId = Convert.ToInt32(PayerId);



        //            try
        //            {
        //                using (SqlConnection connection = new SqlConnection(connectionString))
        //                {
        //                    connection.Open();

        //                    string insertQuery = "INSERT INTO InsuranceEligibility (VisitAccountNo, PatientName,InsuranceMemberID, EffectiveDate, ExpiryDate, Image,PolicyNumber, BlPayerId,PackageName,PackageID,CreatedBy,CreatedOn) " +
        //                     "VALUES (@VisitAccountNo, @PatientName, @InsuranceMemberID, @EffectiveDate, @ExpiryDate, @Image,@PolicyNumber, @BlPayerId,@PackageName,@PackageID,@CreatedBy,@CreatedOn)";
        //                    using (SqlCommand command = new SqlCommand(insertQuery, connection))
        //                    {
        //                        command.Parameters.AddWithValue("@VisitAccountNo", 92638);
        //                        command.Parameters.AddWithValue("@PatientName", ((object)model.PatientName) ?? DBNull.Value);
        //                        command.Parameters.AddWithValue("@InsuranceMemberID", ((object)model.InsuranceMemberID) ?? DBNull.Value);
        //                        command.Parameters.AddWithValue("@EffectiveDate", ((object)model.EffectiveDate) ?? DBNull.Value);
        //                        command.Parameters.AddWithValue("@ExpiryDate", ((object)model.ExpiryDate) ?? DBNull.Value);
        //                        command.Parameters.AddWithValue("@Image", ((object)model.Image) ?? DBNull.Value);
        //                        command.Parameters.AddWithValue("@PolicyNumber", ((object)model.PolicyNumber) ?? DBNull.Value);
        //                        command.Parameters.AddWithValue("@BlPayerId", ((object)model.BlPayerId) ?? DBNull.Value);
        //                        command.Parameters.AddWithValue("@PackageName", ((object)model.PackageName) ?? DBNull.Value);
        //                        command.Parameters.AddWithValue("@PackageID", ((object)model.PackageId) ?? DBNull.Value);
        //                        command.Parameters.AddWithValue("@CreatedBy", model.CreatedBy);
        //                        command.Parameters.AddWithValue("@CreatedOn", model.CreatedOn);
        //                        int rowsAffected = await command.ExecuteNonQueryAsync();


        //                        if (rowsAffected == 1)
        //                        {
        //                            gdpictureImaging.ReleaseGdPictureImage(imageId);
        //                            gdpictureOCR.ReleaseOCRResults();
        //                            return model;
        //                        }
        //                        else
        //                        {
        //                            model.Message = "Not Inserted";
        //                            return model;
        //                        }
        //                    }
        //                    connection.Close();


        //                }

        //            }
        //            catch (Exception ex)
        //            {
        //                // Handle the exception
        //                var exception = ex;
        //                throw ex;
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {

        //        throw ex;
        //    }
        //}
        private string GetInternalFieldName(SqlConnection connection, long PayerId, string cardFieldName)
        {
            string internalFieldName = null;
            connection.Open();
            using (var command = new SqlCommand("SELECT TOP 1 InternalFieldName FROM InsuranceCompanyFieldMapping WHERE BlPayerId = @PayerId AND CardFieldName = @CardFieldName", connection))
            {
                command.Parameters.AddWithValue("@PayerId", PayerId);
                command.Parameters.AddWithValue("@CardFieldName", cardFieldName);
                var result = command.ExecuteScalar();
                if (result != null)
                {
                    internalFieldName = result.ToString();
                }
            }


            return internalFieldName;
        }

        private async Task<List<string>> GetColumnsValuesAsync(SqlConnection connection)
        {
            List<string> emptyColumns = new List<string>();

            using (SqlCommand command = connection.CreateCommand())
            {
                command.CommandText = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'InsuranceEligibility';";

                using (SqlDataReader reader = await command.ExecuteReaderAsync())
                {
                    while (reader.Read())
                    {
                        string columnName = reader.GetString(0);
                        emptyColumns.Add(columnName);
                    }
                }
            }

            return emptyColumns;
        }
        public async Task<object> GetInsuranceRelation()
        {
            var chkResult = await Task.Run(() => _context.InsuranceRelations.Where(x => x.IsDeleted == false).ToList());
            return chkResult;
            //return null;
        }

        public async Task<string> UpdateSubscriberDB(InsuranceSubscriber regUpdate)
        {
            try
            {
                var chkResult = await Task.Run(() => _context.InsuredSubscribers.Include(c => c.InsuredPolicies).Include(c => c.DeductiblePercents).Where(x => x.SubscriberId == regUpdate.SubscriberID && x.IsDeleted == false).FirstOrDefaultAsync());
                if (chkResult != null && chkResult.SubscriberId > 0)
                {
                    chkResult.SubscriberId = regUpdate.SubscriberID;
                    chkResult.CarrierId = regUpdate.CarrierId;
                    chkResult.InsuredIdno = regUpdate.InsuredIDNo;
                    chkResult.InsuredGroupOrPolicyNo = regUpdate.InsuredGroupOrPolicyNo;
                    chkResult.InsuredGroupOrPolicyName = regUpdate.InsuredGroupOrPolicyName;
                    chkResult.CompanyOrIndividual = regUpdate.CompanyOrIndividual;
                    chkResult.Copay = regUpdate.Copay;
                    chkResult.Suffix = regUpdate.Suffix;
                    chkResult.FirstName = regUpdate.FirstName;
                    chkResult.MiddleName = regUpdate.MiddleName;
                    chkResult.LastName = regUpdate.LastName;
                    chkResult.BirthDate = regUpdate.BirthDate;
                    chkResult.Sex = regUpdate.Sex;
                    chkResult.InsuredPhone = regUpdate.InsuredPhone;
                    chkResult.OtherPhone = regUpdate.OtherPhone;
                    chkResult.Address1 = regUpdate.Address1;
                    chkResult.Address2 = regUpdate.Address2;
                    chkResult.ZipCode = regUpdate.ZipCode;
                    chkResult.CityId = regUpdate.CityId;
                    chkResult.StateId = regUpdate.StateId;
                    chkResult.CountryId = regUpdate.CountryId;
                    chkResult.Inactive = regUpdate.Inactive;
                    chkResult.EnteredBy = regUpdate.EnteredBy;
                    chkResult.Verified = regUpdate.Verified;
                    chkResult.ChkDeductibles = regUpdate.ChkDeductible;
                    chkResult.Deductibles = regUpdate.Deductibles;
                    chkResult.Dndeductible = regUpdate.DNDeductible;
                    chkResult.Opcopay = regUpdate.OpCopay;
                    chkResult.Mrno = regUpdate.MRNo;
                    chkResult.CoverageOrder = regUpdate.CoverageOrder;
                    chkResult.IsSelected = regUpdate.IsSelected;
                    var allExisitingRegInsurancePolicy = chkResult.InsuredPolicies.Where(x => x.IsDeleted == false).ToList();
                    if (allExisitingRegInsurancePolicy != null && allExisitingRegInsurancePolicy.Count > 0)
                    {
                        foreach (var item in allExisitingRegInsurancePolicy)
                        {
                            if (regUpdate.regInsurancePolicy != null && regUpdate.regInsurancePolicy.Count > 0)
                            {
                                var chkCurrentRegInsurancePolicy = regUpdate.regInsurancePolicy.SingleOrDefault(x => x.InsuredPolicyId.Equals(item.InsuredPolicyId));
                                if (chkCurrentRegInsurancePolicy == null)
                                {
                                    item.IsDeleted = true;
                                    _context.Entry(item).State = EntityState.Modified;
                                }
                            }
                            else
                            {
                                item.IsDeleted = true;
                                _context.Entry(item).State = EntityState.Modified;
                            }
                        }
                    }
                    if (regUpdate.regInsurancePolicy != null && regUpdate.regInsurancePolicy.Count > 0)
                    {
                        foreach (var item in regUpdate.regInsurancePolicy)
                        {
                            var exisitingInsuredPolicies = chkResult.InsuredPolicies.SingleOrDefault(x => x.InsuredPolicyId.Equals(item.InsuredPolicyId) && x.IsDeleted == false && x.Amount.Equals(item.Amount) && x.EffectiveDate.Equals(item.EffectiveDate) && x.GroupNo.Equals(item.GroupNo) && x.NoOfVisits.Equals(item.NoOfVisits) && x.Status.Equals(item.Status) && x.TerminationDate.Equals(item.TerminationDate) && x.SubscriberId.Equals(item.SubscriberId));
                            if (exisitingInsuredPolicies != null)
                            {
                                exisitingInsuredPolicies.IsDeleted = item.IsDeleted;
                                exisitingInsuredPolicies.NoOfVisits = (int?)item.NoOfVisits;
                                exisitingInsuredPolicies.InsuredPolicyId = item.InsuredPolicyId;
                                exisitingInsuredPolicies.SubscriberId = item.SubscriberId;
                                exisitingInsuredPolicies.Amount = item.Amount;
                                exisitingInsuredPolicies.EffectiveDate = item.EffectiveDate;
                                exisitingInsuredPolicies.GroupNo = item.GroupNo;
                                exisitingInsuredPolicies.TerminationDate = item.TerminationDate;
                                exisitingInsuredPolicies.Status = item.Status;
                                _context.Entry(exisitingInsuredPolicies).State = EntityState.Modified;
                            }
                            else
                            {
                                Core.Entities.InsuredPolicy IP = new Core.Entities.InsuredPolicy()
                                {
                                    IsDeleted = item.IsDeleted,
                                    NoOfVisits = (int?)item.NoOfVisits,
                                    InsuredPolicyId = item.InsuredPolicyId,
                                    SubscriberId = item.SubscriberId,
                                    Amount = item.Amount,
                                    EffectiveDate = item.EffectiveDate,
                                    GroupNo = item.GroupNo,
                                    TerminationDate = item.TerminationDate,
                                    Status = item.Status,
                                };
                                chkResult.InsuredPolicies.Add(IP);
                            }
                        }
                    }
                    var allExisitingRegDeduct = chkResult.DeductiblePercents.Where(x => x.IsDeleted == false).ToList();
                    if (allExisitingRegDeduct != null && allExisitingRegDeduct.Count > 0)
                    {
                        foreach (var item in allExisitingRegDeduct)
                        {
                            if (regUpdate.regDeduct != null && regUpdate.regDeduct.Count > 0)
                            {
                                var chkCurrentRegDeduct = regUpdate.regDeduct.SingleOrDefault(x => x.DeductibleId.Equals(item.DeductibleId));
                                if (chkCurrentRegDeduct == null)
                                {
                                    item.IsDeleted = true;
                                    _context.Entry(item).State = EntityState.Modified;
                                }
                            }
                            else
                            {
                                item.IsDeleted = true;
                                _context.Entry(item).State = EntityState.Modified;
                            }
                        }
                    }
                    if (regUpdate.regDeduct != null && regUpdate.regDeduct.Count > 0)
                    {
                        foreach (var item in regUpdate.regDeduct)
                        {
                            var exisitingDeductiblePercents = chkResult.DeductiblePercents.SingleOrDefault(x => x.DeductibleId.Equals(item.DeductibleId) && x.IsDeleted == false && x.ServiceType.Equals(item.ServiceType) && x.SubscriberId.Equals(item.SubscriberId) && x.Deductible.Equals(item.Deductible));
                            if (exisitingDeductiblePercents != null)
                            {
                                exisitingDeductiblePercents.IsDeleted = item.IsDeleted;
                                exisitingDeductiblePercents.SubscriberId = item.SubscriberId;
                                exisitingDeductiblePercents.DeductibleId = item.DeductibleId;
                                exisitingDeductiblePercents.ServiceType = item.ServiceType;
                                exisitingDeductiblePercents.Deductible = item.Deductible;
                                _context.Entry(exisitingDeductiblePercents).State = EntityState.Modified;
                            }
                            else
                            {
                                Core.Entities.DeductiblePercent DP = new Core.Entities.DeductiblePercent()
                                {
                                    IsDeleted = item.IsDeleted,
                                    SubscriberId = item.SubscriberId,
                                    DeductibleId = item.DeductibleId,
                                    ServiceType = item.ServiceType,
                                    Deductible = item.Deductible,
                                };
                                chkResult.DeductiblePercents.Add(DP);
                            }
                        }
                    }
                    _context.InsuredSubscribers.Update(chkResult);
                    await _context.SaveChangesAsync();
                    return "OK";
                }
                return "Error";
            }
            catch (Exception ex)
            {
                return (ex.Message);
            }
        }
    }
}
