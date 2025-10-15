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
using HMIS.Infrastructure.Helpers;
using HMIS.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using HMIS.Application.DTOs.Registration;
using HMIS.Application.DTOs.SpLocalModel;

namespace HMIS.Application.ServiceLogics
{
    public class TempDemographicManager : ITempDemographicManager
    {
        private readonly HMISDbContext _context;
        public TempDemographicManager(HMISDbContext context)
        {
            _context = context;
        }
        public async Task<DataSet> TempDemoDB(long? TempId, string? Name, string? Address, int? PersonEthnicityTypeId, string? Mobile, string? DOB, string? Gender, int? Country, int? State, int? City, string? ZipCode, int? InsuredId, int? CarrierId,int? Page,int? Size,string? SortColumn,string? SortOrder)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@TempId", TempId, DbType.Int64);

                param.Add("@Name", Name, DbType.String);

                param.Add("@Address", Address, DbType.String);

                param.Add("@PersonEthnicityTypeId", PersonEthnicityTypeId, DbType.Int32);

                param.Add("@Mobile", Mobile, DbType.String);

                param.Add("@DOB", DOB, DbType.String);

                param.Add("@Gender", Gender, DbType.String);

                param.Add("@Country", Country, DbType.Int32);

                param.Add("@State", State, DbType.Int32);

                param.Add("@City", City, DbType.Int32);

                param.Add("@ZipCode", ZipCode, DbType.String);

                param.Add("@InsuredId", InsuredId, DbType.Int32);

                param.Add("@CarrierId", CarrierId, DbType.Int32);

                param.Add("@Page", Page, DbType.Int32);

                param.Add("@Size",Size,DbType.Int32);

                param.Add("@SortColumn", SortColumn, DbType.String);

                param.Add("@SortOrder", SortOrder, DbType.String);




                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("REG_GetTempDemographic_new", param);
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
        public async Task<DataSet> GetTempDemoByTempId(string TempId)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@TempId", TempId, DbType.String);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("REG_GetTempDemographicById", param);
                if (ds.Tables[0].Rows.Count == 0)
                {

                    return new DataSet();
                    //                    throw new Exception("No data found");
                }

                return ds;
            }
            catch (Exception ex)
            {
                return new DataSet();
            }
        }
        public async Task<bool> InsertTempDemoDB(RegTempPatient reg)
        {
            try
            {
                RegPatientTemp regPatientTemp = new RegPatientTemp()
                {
                    PersonFullName = reg.PersonFirstName + " " + reg.PersonMiddleName + " " + reg.PersonLastName,
                    PersonCellPhone = reg.PersonCellPhone,
                    PatientBirthDate = reg.PatientBirthDate,

                    PersonTitleId = reg.PersonTitleId > 0 ? reg.PersonTitleId : null,
                    PersonAge = reg.PersonAge > 0 ? reg.PersonAge : null,
                    PersonNationalityId = reg.PersonNationalityId > 0 ? reg.PersonNationalityId : null,
                    PersonSex = string.IsNullOrWhiteSpace(reg.PersonSex) ? null : reg.PersonSex,

                    PersonAddress1 = string.IsNullOrWhiteSpace(reg.PersonAddress1) ? null : reg.PersonAddress1,
                    PersonAddress2 = string.IsNullOrWhiteSpace(reg.PersonAddress2) ? null : reg.PersonAddress2,
                    PersonCountryId = reg.PersonCountryId > 0 ? reg.PersonCountryId : null,
                    PersonStateId = reg.PersonStateId > 0 ? reg.PersonStateId : null,
                    PersonCityId = reg.PersonCityId > 0 ? reg.PersonCityId : null,
                    PersonZipCode = string.IsNullOrWhiteSpace(reg.PersonZipCode) ? null : reg.PersonZipCode,
                    PersonHomePhone1 = string.IsNullOrWhiteSpace(reg.PersonHomePhone1) ? null : reg.PersonHomePhone1,
                    PersonWorkPhone1 = string.IsNullOrWhiteSpace(reg.PersonWorkPhone1) ? null : reg.PersonWorkPhone1,
                    PersonEmail = string.IsNullOrWhiteSpace(reg.PersonEmail) ? null : reg.PersonEmail,

                    NokfullName = string.Join(" ", new[] { reg.NOKFirstName, reg.NOKMiddleName, reg.NOKLastName }
                                            .Where(x => !string.IsNullOrWhiteSpace(x))),
                    NokrelationshipId = reg.NOKRelationshipId > 0 ? reg.NOKRelationshipId : null,
                    NokhomePhone = string.IsNullOrWhiteSpace(reg.NOKHomePhone) ? null : reg.NOKHomePhone,
                    NokworkPhone = string.IsNullOrWhiteSpace(reg.NOKWorkPhone) ? null : reg.NOKWorkPhone,
                    NokcellNo = string.IsNullOrWhiteSpace(reg.NOKCellNo) ? null : reg.NOKCellNo,
                    NoksocialSecurityNo = string.IsNullOrWhiteSpace(reg.NOKSocialSecurityNo) ? null : reg.NOKSocialSecurityNo,
                    Nokaddress1 = string.IsNullOrWhiteSpace(reg.NOKAddress1) ? null : reg.NOKAddress1,
                    Nokaddress2 = string.IsNullOrWhiteSpace(reg.NOKAddress2) ? null : reg.NOKAddress2,
                    NokcountryId = reg.NOKCountryId > 0 ? reg.NOKCountryId : null,
                    NokstateId = reg.NOKStateId > 0 ? reg.NOKStateId : null,
                    NokcityId = reg.NOKCityId > 0 ? reg.NOKCityId : null,
                    NokzipCode = string.IsNullOrWhiteSpace(reg.NOKZipCode) ? null : reg.NOKZipCode,

                    StreetNumber = string.IsNullOrWhiteSpace(reg.StreetNumber) ? null : reg.StreetNumber,
                    DwellingNumber = string.IsNullOrWhiteSpace(reg.DwellingNumber) ? null : reg.DwellingNumber,
                    Comments = string.IsNullOrWhiteSpace(reg.Comments) ? null : reg.Comments,

                    CreatedBy = string.IsNullOrWhiteSpace(reg.CreatedBy) ? null : reg.CreatedBy,
                    UpdatedBy = string.IsNullOrWhiteSpace(reg.UpdatedBy) ? null : reg.UpdatedBy,
                };
                await _context.RegPatientTemp.AddAsync(regPatientTemp);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public async Task<bool> UpdateTempDemoDB(RegTempPatient reg)
        {
            try
            {
                var chkResult = await Task.Run(() => _context.RegPatientTemp.Where(x => x.TempId.Equals(reg.TempId) && x.IsDeleted == false).FirstOrDefaultAsync());
                if (chkResult != null && chkResult.TempId > 0)
                {
                    chkResult.TempId = reg.TempId;
                    chkResult.PersonAge = reg.PersonAge;
                    chkResult.PersonTitleId = reg.PersonTitleId;
                    chkResult.PersonNationalityId = reg.PersonNationalityId;
                    chkResult.PersonFullName = reg.PersonFirstName + ' ' + reg.PersonMiddleName + ' ' + reg.PersonLastName;
                    chkResult.PersonSex = reg.PersonSex;
                    chkResult.PersonCellPhone = reg.PersonCellPhone;
                    chkResult.PersonAddress1 = reg.PersonAddress1;
                    chkResult.PersonAddress2 = reg.PersonAddress2;
                    chkResult.PersonCountryId = reg.PersonCountryId;
                    chkResult.PersonStateId = reg.PersonStateId;
                    chkResult.PersonCityId = reg.PersonCityId;
                    chkResult.PersonZipCode = reg.PersonZipCode;
                    chkResult.PersonHomePhone1 = reg.PersonHomePhone1;
                    chkResult.PersonWorkPhone1 = reg.PersonWorkPhone1;
                    chkResult.PersonEmail = reg.PersonEmail;
                    chkResult.NokfullName = reg.NOKFirstName + ' ' + reg.NOKMiddleName + ' ' + reg.NOKLastName;
                    chkResult.NokrelationshipId = reg.NOKRelationshipId;
                    chkResult.NokhomePhone = reg.NOKHomePhone;
                    chkResult.NokworkPhone = reg.NOKWorkPhone;
                    chkResult.NokcellNo = reg.NOKCellNo;
                    chkResult.NoksocialSecurityNo = reg.NOKSocialSecurityNo;
                    chkResult.Nokaddress1 = reg.NOKAddress1;
                    chkResult.Nokaddress2 = reg.NOKAddress2;
                    chkResult.NokcountryId = reg.NOKCountryId;
                    chkResult.NokstateId = reg.NOKStateId;
                    chkResult.NokcityId = reg.NOKCityId;
                    chkResult.NokzipCode = reg.NOKZipCode;
                    chkResult.StreetNumber = reg.StreetNumber;
                    chkResult.DwellingNumber = reg.DwellingNumber;
                    chkResult.Comments = reg.Comments;
                    chkResult.CreatedBy = reg.CreatedBy;
                    chkResult.UpdatedBy = reg.UpdatedBy;
                    chkResult.Active = reg.Active;
                    chkResult.PatientBirthDate = reg.PatientBirthDate;
                    _context.RegPatientTemp.Update(chkResult);
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

        public async Task<bool> DeleteTempDemographicDB(int TempId)
        {
            var findResult = await Task.Run(() => _context.RegPatientTemp.Where(x => x.TempId.Equals(TempId) && x.IsDeleted == false).FirstOrDefaultAsync());
            if (findResult != null)
            {
                findResult.IsDeleted = true;

                _context.RegPatientTemp.Update(findResult);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
        public async Task<DataSet> TempDemoDB_with_pagination(TempDemographicList req)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@TempId", req.TempListReq.TempId, DbType.Int64);

                param.Add("@Name", req.TempListReq.Name, DbType.String);

                //param.Add("@Address", req.TempListReq.Address, DbType.String);

                //param.Add("@PersonEthnicityTypeId", req.TempListReq.PersonEthnicityTypeId, DbType.Int32);

                //param.Add("@Mobile", req.TempListReq.Mobile, DbType.String);

                param.Add("@DOB", req.TempListReq.DOB, DbType.String);

                param.Add("@Gender", req.TempListReq.Gender, DbType.String);

                param.Add("@Country", req.TempListReq.Country, DbType.Int32);

                param.Add("@Email", req.TempListReq.Email, DbType.String);

                //param.Add("@State", req.TempListReq.State, DbType.Int32);

                //param.Add("@City", req.TempListReq.City, DbType.Int32);

                //param.Add("@ZipCode", ZipCode, DbType.String);

                //param.Add("@InsuredId", InsuredId, DbType.Int32);

                //param.Add("@CarrierId", CarrierId, DbType.Int32);

                param.Add("@Page", req.paginationInfo.Page, DbType.Int32);

                param.Add("@PageSize", req.paginationInfo.RowsPerPage, DbType.Int32);

                //param.Add("@SortColumn", SortColumn, DbType.String);

                //param.Add("@SortOrder", SortOrder, DbType.String);




                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("REG_GetTempDemographic_new_with_pagination", param);
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
    }
}