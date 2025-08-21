using Dapper;
using HMIS.Infrastructure.Helpers;
using HMIS.Infrastructure.ORM;
using HMIS.Core.Entities;
using HMIS.Application.DTOs.AppointmentDTOs;
using HMIS.Application.DTOs.ControlPanel;
using HMIS.Application.Implementations;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static HMIS.Application.DTOs.SpLocalModel.UserListModel;

namespace HMIS.Application.ServiceLogics
{
    public class UserManager : IUserManager
    {
        private readonly HMISDbContext _context;
        public UserManager(HMISDbContext context)
        {
            _context = context;
        }

        public async Task<bool> InsertLicense(DTOs.ControlPanel.HrlicenseInfo license)
        {
            try
            {


                DataTable empLicense = ConversionHelper.ObjectToData(license);


                DynamicParameters parameters = new DynamicParameters();


                parameters.Add("@HRLicenseInfoTypeVar", empLicense, DbType.Object);


                bool res = await DapperHelper.ExcecuteSPByParams("CP_InsertHRLicense", parameters);

                if (res)
                {
                    return res;
                }
            }
            catch (Exception ex)
            {
                return false;
            }

            return false;
        }

        public async Task<bool> InsertUserDB(DTOs.ControlPanel.Hremployee hremployee)
        {

            try
            {



                HashingHelper hashHelper = HashingHelper.GetInstance();

                string pwdHash = hashHelper.ComputeHash(hremployee.Password);
                hremployee.Password = pwdHash;



                DataTable EmployeeFacilityDT = ConversionHelper.ToDataTable(hremployee.EmployeeFacility != null ? hremployee.EmployeeFacility : new List<DTOs.ControlPanel.HREmployeeFacility>());

                DataTable LicenseInfoDT = ConversionHelper.ToDataTable(hremployee.LicenseInfo != null ? hremployee.LicenseInfo : new List<DTOs.ControlPanel.HrlicenseInfo>());

                DataTable SecEmployeeRoleDT = ConversionHelper.ToDataTable(hremployee.EmployeeRole != null ? hremployee.EmployeeRole : new List<DTOs.ControlPanel.SecEmployeeRole>());


                DTOs.ControlPanel.Hremployee EMP = new DTOs.ControlPanel.Hremployee();
                EMP = hremployee;


                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("EmployeeType", EMP.EmployeeType, DbType.Int16);
                //parameters.Add("FacilityID", hremployee.EmployeeFacility[0].FacilityID, DbType.Int16);

                //parameters.Add("RoleId", hremployee.EmployeeRole[0].RoleId, DbType.Int16);

                parameters.Add("LicenseNo", hremployee.DriversLicenseNo, DbType.Int32);
                parameters.Add("Prefix", EMP.Prefix, DbType.String);

                parameters.Add("FullName", EMP.FullName, DbType.String);    

                parameters.Add("ArFullName", EMP.ArFullName, DbType.String);

                parameters.Add("IsEmployee", EMP.IsEmployee, DbType.Boolean);

                parameters.Add("Credential", EMP.Credential, DbType.String);

                parameters.Add("Nic", EMP.Nic, DbType.String);

                parameters.Add("CityID", EMP.CityID, DbType.Int64);

                parameters.Add("CountryID", EMP.CountryID, DbType.Int64);

                parameters.Add("StateID", EMP.StateID, DbType.String);

                parameters.Add("ZipCode", EMP.ZipCode, DbType.String);

                parameters.Add("CellNo", EMP.CellNo, DbType.String);

                parameters.Add("Phone", EMP.Phone, DbType.String);

                parameters.Add("Email", EMP.Email, DbType.String);

                parameters.Add("Fax", EMP.Fax, DbType.String);

                parameters.Add("DriversLicenseNo", EMP.DriversLicenseNo, DbType.String);

                parameters.Add("DOB", EMP.DOB, DbType.DateTime);

                parameters.Add("Gender", EMP.Gender, DbType.String);

                parameters.Add("BloodGroup", EMP.BloodGroup, DbType.String);

                parameters.Add("MaritalStatus", EMP.MaritalStatus, DbType.String);

                parameters.Add("Active", EMP.Active, DbType.Boolean);

                parameters.Add("UserName", EMP.UserName, DbType.String);

                parameters.Add("Password", EMP.Password, DbType.String);

                parameters.Add("HomeAddress1", EMP.HomeAddress1, DbType.String);

                parameters.Add("HomeAddress2", EMP.HomeAddress2, DbType.String);

                parameters.Add("IsAdmin", EMP.IsAdmin, DbType.Boolean);

                parameters.Add("HomePager", EMP.HomePager, DbType.String);

                parameters.Add("EmerRelationship", EMP.EmerRelationship, DbType.String);

                parameters.Add("EmerFullName", EMP.EmerFullName, DbType.String);

                parameters.Add("EmerAddress1", EMP.EmerAddress1, DbType.String);

                parameters.Add("EmerAddress2", EMP.EmerAddress2, DbType.String);

                parameters.Add("EmerCountryId", EMP.EmerCountryId, DbType.Int64);

                parameters.Add("EmerStateId", EMP.EmerStateId, DbType.Int64);

                parameters.Add("EmerCityId", EMP.EmerCityId, DbType.Int64);

                parameters.Add("EmerZipCode", EMP.EmerZipCode, DbType.String);

                parameters.Add("EmerEmail", EMP.EmerEmail, DbType.String);

                parameters.Add("EmerPhone", EMP.EmerPhone, DbType.String);

                parameters.Add("EmerCellPhone", EMP.EmerCellPhone, DbType.String);

                parameters.Add("EmerPager", EMP.EmerPager, DbType.String);

                parameters.Add("EmerFax", EMP.EmerFax, DbType.String);

                parameters.Add("UserPicture", EMP.UserPicture, DbType.Binary);

                parameters.Add("ProvRemAddress2", EMP.ProvRemAddress2, DbType.String);

                parameters.Add("ProvStateLicNo", EMP.ProvStateLicNo, DbType.String);

                parameters.Add("ProvDeaNo", EMP.ProvDeaNo, DbType.String);

                parameters.Add("ProvCtrlSubsNo", EMP.ProvCtrlSubsNo, DbType.String);

                parameters.Add("ProvUpin", EMP.ProvUpin, DbType.String);

                parameters.Add("ProvTaxonomy", EMP.ProvTaxonomy, DbType.String);

                parameters.Add("IsPerson", EMP.IsPerson, DbType.String);

                parameters.Add("IsRefProvider", EMP.IsRefProvider, DbType.Boolean);

                parameters.Add("PasswordResetByAdmin", EMP.PasswordResetByAdmin, DbType.Boolean);

                parameters.Add("PasswordUpdatedDate", EMP.PasswordUpdatedDate, DbType.DateTime);

                parameters.Add("ProvNPI", EMP.ProvNPI, DbType.String);

                parameters.Add("Initials", EMP.Initials, DbType.String);

                parameters.Add("DHCCCode", EMP.DHCCCode, DbType.String);

                parameters.Add("ProviderSPID", EMP.ProviderSPID, DbType.Int64);

                parameters.Add("VIPPatientAccess", EMP.VIPPatientAccess, DbType.Boolean);

                parameters.Add("JoiningDate", EMP.JoiningDate, DbType.DateTime);

                parameters.Add("AllowChgCap", EMP.AllowChgCap, DbType.Boolean);

                parameters.Add("ErxUserName", EMP.ErxUserName, DbType.String);

                parameters.Add("ErxPass", EMP.ErxPass, DbType.String);

                parameters.Add("HaadLicType", EMP.HaadLicType, DbType.String);

                parameters.Add("DrCashPrice", EMP.DrCashPrice, DbType.String);

                parameters.Add("GrantAccessToMalaffi", EMP.GrantAccessToMalaffi, DbType.Boolean);

                parameters.Add("MalaffiRoleLevel", EMP.MalaffiRoleLevel, DbType.Int64);

                parameters.Add("EnableMBR", EMP.EnableMBR, DbType.Boolean);

                parameters.Add("SignatureImage", EMP.SignatureImage, DbType.Binary);

                parameters.Add("CreatedBy", EMP.CreatedBy, DbType.String);

                parameters.Add("UpdatedBy", EMP.UpdatedBy, DbType.String);

                parameters.Add("PassPortNo", EMP.PassPortNo, DbType.String);

                parameters.Add("BusAddress1", EMP.BusAddress1, DbType.String);

                parameters.Add("BusAddress2", EMP.BusAddress2, DbType.String);

                parameters.Add("BusCountryId", EMP.BusCountryId, DbType.Int64);

                parameters.Add("BusCityId", EMP.BusCityId, DbType.Int64);

                parameters.Add("BusStateId", EMP.BusStateId, DbType.Int64);

                parameters.Add("BusZipCode", EMP.BusZipCode, DbType.String);

                parameters.Add("BusEmail", EMP.BusEmail, DbType.String);

                parameters.Add("BusPhone", EMP.BusPhone, DbType.String);

                parameters.Add("BusCellPhone", EMP.BusCellPhone, DbType.String);

                parameters.Add("BusPager", EMP.BusPager, DbType.String);

                parameters.Add("BusFax", EMP.BusFax, DbType.String);

                parameters.Add("@HREmployeeFacilityTypeVar", EmployeeFacilityDT, DbType.Object);

                parameters.Add("@HRLicenseInfoTypeVar", LicenseInfoDT, DbType.Object);

                parameters.Add("@SecEmployeeRoleTypeVar", SecEmployeeRoleDT, DbType.Object);


                bool res = await DapperHelper.ExcecuteSPByParams("CP_InsertHREmployee", parameters);

                if (res)
                {
                    return res;
                }
            }
            catch (Exception ex)
            {

                return false;
            }


            return false;
        }
        private bool Exist(long id)
        {
            var employee = _context.Hremployees.Find(id);
            return employee != null;
        }
        //public async Task<bool> InsertUserDB1(DTOs.ControlPanel.Hremployee hremployee)
        //{

        //    try
        //    {

        //        DTOs.ControlPanel.Hremployee EMP = new DTOs.ControlPanel.Hremployee();


        //        HashingHelper hashHelper2 = HashingHelper.GetInstance();

        //        string pwdHash2 = hashHelper2.ComputeHash(hremployee.Password ?? "");
        //        hremployee.Password = pwdHash2 ?? "";
        //        EMP = hremployee;

        //        DataTable EmployeeFacilityDT = ConversionHelper.ToDataTable(hremployee.EmployeeFacility != null ? hremployee.EmployeeFacility : new List<DTOs.ControlPanel.HREmployeeFacility>());

        //        DataTable LicenseInfoDT = ConversionHelper.ToDataTable(hremployee.LicenseInfo != null ? hremployee.LicenseInfo : new List<DTOs.ControlPanel.HrlicenseInfo>());

        //        DataTable SecEmployeeRoleDT = ConversionHelper.ToDataTable(hremployee.EmployeeRole != null ? hremployee.EmployeeRole : new List<DTOs.ControlPanel.SecEmployeeRole>());



        //        bool exist = Exist(hremployee.EmployeeId);
        //        if (exist)
        //        {
        //            var hrEmp = _context.Hremployees
        //                .Where(x => x.EmployeeId.Equals(hremployee.EmployeeId) && x.IsDeleted == false).FirstOrDefault();

        //            if (hrEmp != null)
        //            {
        //                hrEmp.EmployeeType = hremployee.EmployeeType;
        //                hrEmp.Prefix = hremployee.Prefix;
        //                hrEmp.FullName = hremployee.FullName;
        //                hrEmp.ArFullName = hremployee.ArFullName;
        //                hrEmp.IsEmployee = hremployee.IsEmployee;
        //                hrEmp.Credential = hremployee.Credential;
        //                hrEmp.Nic = hremployee.Nic;
        //                hrEmp.CityId = hremployee.CityID;
        //                hrEmp.CountryId = hremployee.CountryID;
        //                hrEmp.StateId = hremployee.StateID;
        //                hrEmp.ZipCode = hremployee.ZipCode;
        //                hrEmp.CellNo = hremployee.CellNo;
        //                hrEmp.Phone = hremployee.Phone;
        //                hrEmp.Email = hremployee.Email;
        //                hrEmp.Fax = hremployee.Fax;
        //                hrEmp.Gender = hremployee.Gender;
        //                hrEmp.DriversLicenseNo = hremployee.DriversLicenseNo;
        //                hrEmp.DriversLicenseNo = hremployee.DriversLicenseNo;
        //                hrEmp.Dob = hremployee.DOB;
        //                hrEmp.BloodGroup = hremployee.BloodGroup;
        //                hrEmp.MaritalStatus = hremployee.MaritalStatus;
        //                hrEmp.Active = hremployee.Active;
        //                hrEmp.UserName = hremployee.UserName;
        //                // hrEmp.Password = pwdHash2;
        //                hrEmp.HomeAddress1 = hremployee.HomeAddress1;
        //                hrEmp.HomeAddress2 = hremployee.HomeAddress2;
        //                hrEmp.IsAdmin = hremployee.IsAdmin;
        //                hrEmp.HomePager = hremployee.HomePager;
        //                hrEmp.EmerRelationship = hremployee.EmerRelationship;
        //                hrEmp.EmerFullName = hremployee.EmerFullName;
        //                hrEmp.EmerAddress1 = hremployee.EmerAddress1;
        //                hrEmp.EmerAddress2 = hremployee.EmerAddress2;
        //                hrEmp.EmerCountryId = hremployee.EmerCountryId;
        //                hrEmp.EmerStateId = hremployee.EmerStateId;
        //                hrEmp.EmerCityId = hremployee.EmerCityId;
        //                hrEmp.EmerZipCode = hremployee.EmerZipCode;
        //                hrEmp.EmerEmail = hremployee.EmerEmail;
        //                hrEmp.EmerCellPhone = hremployee.CellNo;
        //                hrEmp.EmerPager = hremployee.EmerPager;
        //                hrEmp.EmerFax = hremployee.EmerFax;
        //                hrEmp.UserPicture = hremployee.UserPicture;
        //                hrEmp.ProvRemAddress2 = hremployee.ProvRemAddress2;
        //                hrEmp.ProvStateLicNo = hremployee.ProvStateLicNo;
        //                hrEmp.ProvDeaNo = hremployee.ProvDeaNo;
        //                hrEmp.ProvNpi = hremployee.ProvNPI;
        //                hrEmp.ProvTaxonomy = hremployee.ProvTaxonomy;
        //                //hrEmp.IsPerson=emp.IsPerson;
        //                hrEmp.IsRefProvider = hremployee.IsRefProvider;
        //                hrEmp.PasswordResetByAdmin = hremployee.PasswordResetByAdmin;
        //                hrEmp.PasswordUpdatedDate = hremployee.PasswordUpdatedDate;
        //                hrEmp.Initials = hremployee.Initials;
        //                hrEmp.Email = hremployee.Email;
        //                hrEmp.Dhcccode = hremployee.DHCCCode;
        //                hrEmp.ProviderSpid = hremployee.ProviderSPID;
        //                hrEmp.VippatientAccess = hremployee.VIPPatientAccess;
        //                hrEmp.JoiningDate = hremployee.JoiningDate;
        //                hrEmp.AllowChgCap = hremployee.AllowChgCap;
        //                hrEmp.ErxPass = hremployee.ErxPass;
        //                hrEmp.HaadLicType = hremployee.HaadLicType;
        //                hrEmp.DrCashPrice = hremployee.DrCashPrice;
        //                hrEmp.GrantAccessToMalaffi = hremployee.GrantAccessToMalaffi;
        //                hrEmp.MalaffiRoleLevel = Convert.ToByte(hremployee.MalaffiRoleLevel);
        //                hrEmp.EnableMbr = hremployee.EnableMBR;
        //                hrEmp.CreatedOn = DateTime.Now;
        //                //  hrEmp.CreatedBy = hremployee.CreatedBy;
        //                hrEmp.UpdatedOn = hremployee.UpdatedOn;
        //                hrEmp.UpdatedBy = hremployee.UpdatedBy;
        //                hrEmp.PassPortNo = hremployee.PassPortNo;
        //                hrEmp.BusAddress1 = hremployee.BusAddress1;
        //                hrEmp.BusAddress2 = hremployee.BusAddress2;
        //                hrEmp.BusCountryId = hremployee.BusCountryId;
        //                hrEmp.BusCityId = hremployee.BusCityId;
        //                hrEmp.StateId = hremployee.StateID;
        //                hrEmp.BusZipCode = hremployee.BusZipCode;
        //                hrEmp.BusEmail = hremployee.BusEmail;
        //                hrEmp.BusPhone = hremployee.BusPhone;
        //                hrEmp.BusCellPhone = hremployee.BusCellPhone;
        //                hrEmp.BusPager = hremployee.BusPager;
        //                hrEmp.BusFax = hremployee.BusFax;
        //                hrEmp.IsDeleted = false;

        //                _context.Hremployees.Update(hrEmp);


        //                var hremployeeFacilities = _context.HremployeeFacilities
        //                    .Where(x => x.EmployeeId.Equals(hremployee.EmployeeId) && x.IsDeleted == false).ToList();
        //                foreach (var facility in hremployeeFacilities)
        //                {
        //                    var Removehremp = hremployeeFacilities.FirstOrDefault(x => x.EmployeeId == hremployee.EmployeeId && x.FacilityId == facility.FacilityId);
        //                    if (Removehremp != null)
        //                    {
        //                        _context.HremployeeFacilities.Remove(Removehremp);
        //                    }
        //                }


        //                foreach (var facility in hremployee.EmployeeFacility)
        //                {
        //                    var hremp = _context.HremployeeFacilities.FirstOrDefault(x => x.EmployeeId == hremployee.EmployeeId && x.FacilityId == facility.FacilityID && x.IsDeleted == false);
        //                    if (hremp != null)
        //                    {
        //                        hremp.EmployeeId = facility.EmployeeId;
        //                        hremp.UpdatedBy = hremployee.CreatedBy;
        //                        hremp.FacilityId = facility.FacilityID;
        //                        hremp.CreatedOn = DateTime.Now;
        //                        hremp.IsDeleted = false;
        //                        _context.HremployeeFacilities.Update(hremp);
        //                    }
        //                    else
        //                    {
        //                        HremployeeFacility hr = new HremployeeFacility();
        //                        hr.EmployeeId = facility.EmployeeId;
        //                        hr.UpdatedBy = hremployee.CreatedBy;
        //                        hr.FacilityId = facility.FacilityID;
        //                        hr.CreatedOn = DateTime.Now;
        //                        hr.IsDeleted = false;
        //                        _context.HremployeeFacilities.Add(hr);
        //                    }
        //                }
        //                await _context.SaveChangesAsync();


        //                var hrLicenseInfos = _context.HrlicenseInfos
        //                    .Where(x => x.EmployeeId.Equals(hremployee.EmployeeId) && x.IsDeleted == false).ToList();

        //                foreach (var license in hremployee.LicenseInfo)
        //                {
        //                    var hrLicenseInfoToUpdate = hrLicenseInfos.FirstOrDefault(x => x.EmployeeId == hremployee.EmployeeId);
        //                    if (hrLicenseInfoToUpdate != null)
        //                    {
        //                        hrLicenseInfoToUpdate.Active = license.Active;
        //                        hrLicenseInfoToUpdate.LicenseName = license.LicenseName;
        //                        hrLicenseInfoToUpdate.LicenseNo = license.LicenseNo;
        //                        hrLicenseInfoToUpdate.ExpiryDate = license.ExpiryDate;
        //                        hrLicenseInfoToUpdate.EmployeeId = license.EmployeeId;
        //                        hrLicenseInfoToUpdate.IsDeleted = false;

        //                        _context.HrlicenseInfos.Update(hrLicenseInfoToUpdate);
        //                    }
        //                }

        //                await _context.SaveChangesAsync();



        //                var secEmpRoles = _context.SecEmployeeRoles
        //                    .Where(x => x.EmployeeId.Equals(hremployee.EmployeeId) && x.IsDeleted == false).ToList();

        //                foreach (var empRole in hremployee.EmployeeRole)
        //                {
        //                    var secEmpRoleToUpdate = secEmpRoles.FirstOrDefault(x => x.EmployeeId == hremployee.EmployeeId);
        //                    if (secEmpRoleToUpdate != null)
        //                    {
        //                        secEmpRoleToUpdate.EmployeeId = empRole.EmployeeId;
        //                        secEmpRoleToUpdate.UpdatedBy = hremployee.CreatedBy;
        //                        secEmpRoleToUpdate.CreatedOn = DateTime.Now;
        //                        secEmpRoleToUpdate.IsDeleted = false;

        //                        _context.SecEmployeeRoles.Update(secEmpRoleToUpdate);
        //                    }
        //                }

        //                await _context.SaveChangesAsync();


        //            }
        //            return true;

        //        }
        //        else if (!exist)
        //        {

        //            DTOs.ControlPanel.Hremployee emp = new DTOs.ControlPanel.Hremployee();
        //            emp = hremployee;

        //            Core.Entities.Hremployee hrEmp1 = new Core.Entities.Hremployee();

        //            hrEmp1.EmployeeType = emp.EmployeeType;
        //            hrEmp1.Prefix = emp.Prefix;
        //            hrEmp1.FullName = emp.FullName;
        //            hrEmp1.ArFullName = emp.ArFullName;
        //            hrEmp1.IsEmployee = emp.IsEmployee;
        //            hrEmp1.Credential = emp.Credential;
        //            hrEmp1.Nic = emp.Nic;
        //            hrEmp1.CityId = emp.CityID;
        //            hrEmp1.CountryId = emp.CountryID;
        //            hrEmp1.StateId = emp.StateID;
        //            hrEmp1.ZipCode = emp.ZipCode;
        //            hrEmp1.CellNo = emp.CellNo;
        //            hrEmp1.Phone = emp.Phone;
        //            hrEmp1.Email = emp.Email;
        //            hrEmp1.Fax = emp.Fax;
        //            hrEmp1.Gender = emp.Gender;
        //            hrEmp1.DriversLicenseNo = emp.DriversLicenseNo;
        //            hrEmp1.DriversLicenseNo = emp.DriversLicenseNo;
        //            hrEmp1.Dob = emp.DOB;
        //            hrEmp1.BloodGroup = emp.BloodGroup;
        //            hrEmp1.MaritalStatus = emp.MaritalStatus;
        //            hrEmp1.Active = emp.Active;
        //            hrEmp1.UserName = emp.UserName;
        //            hrEmp1.Password = pwdHash2;
        //            hrEmp1.HomeAddress1 = emp.HomeAddress1;
        //            hrEmp1.HomeAddress2 = emp.HomeAddress2;
        //            hrEmp1.IsAdmin = emp.IsAdmin;
        //            hrEmp1.HomePager = emp.HomePager;
        //            hrEmp1.EmerRelationship = emp.EmerRelationship;
        //            hrEmp1.EmerFullName = emp.EmerFullName;
        //            hrEmp1.EmerAddress1 = emp.EmerAddress1;
        //            hrEmp1.EmerAddress2 = emp.EmerAddress2;
        //            hrEmp1.EmerCountryId = emp.EmerCountryId;
        //            hrEmp1.EmerStateId = emp.EmerStateId;
        //            hrEmp1.EmerCityId = emp.EmerCityId;
        //            hrEmp1.EmerZipCode = emp.EmerZipCode;
        //            hrEmp1.EmerEmail = emp.EmerEmail;
        //            hrEmp1.EmerCellPhone = emp.CellNo;
        //            hrEmp1.EmerPager = emp.EmerPager;
        //            hrEmp1.EmerFax = emp.EmerFax;
        //            hrEmp1.UserPicture = emp.UserPicture;
        //            hrEmp1.ProvRemAddress2 = emp.ProvRemAddress2;
        //            hrEmp1.ProvStateLicNo = emp.ProvStateLicNo;
        //            hrEmp1.ProvDeaNo = emp.ProvDeaNo;
        //            hrEmp1.ProvNpi = emp.ProvNPI;
        //            hrEmp1.ProvTaxonomy = emp.ProvTaxonomy;
        //            //hrEmp.IsPerson=emp.IsPerson;
        //            hrEmp1.IsRefProvider = emp.IsRefProvider;
        //            hrEmp1.PasswordResetByAdmin = emp.PasswordResetByAdmin;
        //            hrEmp1.PasswordUpdatedDate = emp.PasswordUpdatedDate;
        //            hrEmp1.Initials = emp.Initials;
        //            hrEmp1.Email = emp.Email;
        //            hrEmp1.Dhcccode = emp.DHCCCode;
        //            hrEmp1.ProviderSpid = emp.ProviderSPID;
        //            hrEmp1.VippatientAccess = emp.VIPPatientAccess;
        //            hrEmp1.JoiningDate = emp.JoiningDate;
        //            hrEmp1.AllowChgCap = emp.AllowChgCap;
        //            hrEmp1.ErxPass = emp.ErxPass;
        //            hrEmp1.HaadLicType = emp.HaadLicType;
        //            hrEmp1.DrCashPrice = emp.DrCashPrice;
        //            hrEmp1.GrantAccessToMalaffi = emp.GrantAccessToMalaffi;
        //            hrEmp1.MalaffiRoleLevel = Convert.ToByte(emp.MalaffiRoleLevel);
        //            hrEmp1.EnableMbr = emp.EnableMBR;
        //            hrEmp1.CreatedOn = DateTime.Now;
        //            hrEmp1.CreatedBy = emp.CreatedBy;
        //            hrEmp1.UpdatedOn = emp.UpdatedOn;
        //            hrEmp1.UpdatedBy = emp.UpdatedBy;
        //            hrEmp1.PassPortNo = emp.PassPortNo;
        //            hrEmp1.BusAddress1 = emp.BusAddress1;
        //            hrEmp1.BusAddress2 = emp.BusAddress2;
        //            hrEmp1.BusCountryId = emp.BusCountryId;
        //            hrEmp1.BusCityId = emp.BusCityId;
        //            hrEmp1.StateId = emp.StateID;
        //            hrEmp1.BusZipCode = emp.BusZipCode;
        //            hrEmp1.BusEmail = emp.BusEmail;
        //            hrEmp1.BusPhone = emp.BusPhone;
        //            hrEmp1.BusCellPhone = emp.BusCellPhone;
        //            hrEmp1.BusPager = emp.BusPager;
        //            hrEmp1.BusFax = emp.BusFax;
        //            hrEmp1.IsDeleted = false;

        //            _context.Hremployees.Add(hrEmp1);
        //            await _context.SaveChangesAsync();

        //            long hrEmployeeId = hrEmp1.EmployeeId;


        //            //Core.Entities.HremployeeFacility hremployeeFacility = new Core.Entities.HremployeeFacility();
        //            //hremployeeFacility.FacilityId = emp.EmployeeFacility[0].FacilityID;
        //            //hremployeeFacility.EmployeeId = hrEmployeeId;
        //            //hremployeeFacility.CreatedBy = emp.CreatedBy;
        //            //hremployeeFacility.CreatedOn = DateTime.Now;
        //            //hremployeeFacility.IsDeleted = false;


        //            //_context.HremployeeFacilities.Add(hremployeeFacility);
        //            //await _context.SaveChangesAsync();

        //            var hremployeeFacilities = _context.HremployeeFacilities
        //                     .Where(x => x.EmployeeId.Equals(hremployee.EmployeeId) && x.IsDeleted == false).ToList();
        //            foreach (var facility in hremployeeFacilities)
        //            {
        //                var Removehremp = hremployeeFacilities.FirstOrDefault(x => x.EmployeeId == hremployee.EmployeeId && x.FacilityId == facility.FacilityId);
        //                if (Removehremp != null)
        //                {
        //                    _context.HremployeeFacilities.Remove(Removehremp);
        //                }
        //            }


        //            foreach (var facility in hremployee.EmployeeFacility)
        //            {
        //                var hremp = _context.HremployeeFacilities.FirstOrDefault(x => x.EmployeeId == hremployee.EmployeeId && x.FacilityId == facility.FacilityID && x.IsDeleted == false);
        //                if (hremp != null)
        //                {
        //                    hremp.EmployeeId = facility.EmployeeId;
        //                    hremp.UpdatedBy = hremployee.CreatedBy;
        //                    hremp.FacilityId = facility.FacilityID;
        //                    hremp.CreatedOn = DateTime.Now;
        //                    hremp.IsDeleted = false;
        //                    _context.HremployeeFacilities.Update(hremp);
        //                }
        //                else
        //                {
        //                    HremployeeFacility hr = new HremployeeFacility();
        //                    hr.EmployeeId = facility.EmployeeId;
        //                    hr.UpdatedBy = hremployee.CreatedBy;
        //                    hr.FacilityId = facility.FacilityID;
        //                    hr.CreatedOn = DateTime.Now;
        //                    hr.IsDeleted = false;
        //                    _context.HremployeeFacilities.Add(hr);
        //                }
        //            }
        //            await _context.SaveChangesAsync();


        //            foreach (var licenseInfo in emp.LicenseInfo)
        //            {
        //                Core.Entities.HrlicenseInfo hrLicenseInfo = new Core.Entities.HrlicenseInfo();

        //                hrLicenseInfo.Active = licenseInfo?.Active ?? false;
        //                hrLicenseInfo.LicenseName = licenseInfo?.LicenseName ?? string.Empty;
        //                hrLicenseInfo.LicenseNo = licenseInfo?.LicenseNo ?? string.Empty;
        //                hrLicenseInfo.ExpiryDate = licenseInfo?.ExpiryDate;
        //                hrLicenseInfo.EmployeeId = hrEmployeeId;
        //                hrLicenseInfo.IsDeleted = false;

        //                _context.HrlicenseInfos.Add(hrLicenseInfo);
        //            }

        //            await _context.SaveChangesAsync();

        //            //Core.Entities.HrlicenseInfo hrLicenseInfo = new Core.Entities.HrlicenseInfo();


        //            //hrLicenseInfo.Active = emp.LicenseInfo[0].Active;
        //            //hrLicenseInfo.LicenseName = emp.LicenseInfo[0].LicenseName;
        //            //hrLicenseInfo.LicenseNo = emp.LicenseInfo[0].LicenseNo;
        //            //hrLicenseInfo.ExpiryDate = emp.LicenseInfo[0].ExpiryDate;
        //            //hrLicenseInfo.EmployeeId = hrEmployeeId;
        //            //hrLicenseInfo.IsDeleted = false;

        //            //_context.HrlicenseInfos.Add(hrLicenseInfo);
        //            //await _context.SaveChangesAsync();

        //            foreach (var employeeRole in emp.EmployeeRole)
        //            {
        //                Core.Entities.SecEmployeeRole secEmpRole = new Core.Entities.SecEmployeeRole();

        //                secEmpRole.EmployeeId = hrEmployeeId;
        //                secEmpRole.RoleId = employeeRole?.RoleId ?? 0;
        //                secEmpRole.CreatedBy = emp.CreatedBy;
        //                secEmpRole.CreatedOn = DateTime.Now;
        //                secEmpRole.IsDeleted = false;

        //                _context.SecEmployeeRoles.Add(secEmpRole);
        //            }

        //            await _context.SaveChangesAsync();




        //            //Core.Entities.SecEmployeeRole secEmpRole = new Core.Entities.SecEmployeeRole();

        //            //secEmpRole.EmployeeId = hrEmployeeId;
        //            //secEmpRole.RoleId = emp.EmployeeRole[0].RoleId;
        //            //secEmpRole.CreatedBy = emp.CreatedBy;
        //            //secEmpRole.CreatedOn = DateTime.Now;
        //            //secEmpRole.IsDeleted = false;

        //            //_context.SecEmployeeRoles.Add(secEmpRole);
        //            //await _context.SaveChangesAsync();

        //            return true;



        //        }

        //        else
        //        {
        //            return false;
        //        }

        //    }
        //    catch (Exception ex)
        //    {

        //        return false;
        //    }



        //}


        public async Task<string> InsertUserDB1(DTOs.ControlPanel.Hremployee hremployee)
        {

            try
            {

                DTOs.ControlPanel.Hremployee EMP = new DTOs.ControlPanel.Hremployee();


                HashingHelper hashHelper2 = HashingHelper.GetInstance();

                string pwdHash2 = hashHelper2.ComputeHash(hremployee.Password ?? "");
                hremployee.Password = pwdHash2 ?? "";
                EMP = hremployee;

                DataTable EmployeeFacilityDT = ConversionHelper.ToDataTable(hremployee.EmployeeFacility != null ? hremployee.EmployeeFacility : new List<DTOs.ControlPanel.HREmployeeFacility>());

                DataTable LicenseInfoDT = ConversionHelper.ToDataTable(hremployee.LicenseInfo != null ? hremployee.LicenseInfo : new List<DTOs.ControlPanel.HrlicenseInfo>());

                DataTable SecEmployeeRoleDT = ConversionHelper.ToDataTable(hremployee.EmployeeRole != null ? hremployee.EmployeeRole : new List<DTOs.ControlPanel.SecEmployeeRole>());



                bool exist = Exist(hremployee.EmployeeId);
                if (exist)
                {
                    var hrEmp = _context.Hremployees
                        .Where(x => x.EmployeeId.Equals(hremployee.EmployeeId) && x.IsDeleted == false).FirstOrDefault();

                    if (hrEmp != null)
                    {
                        hrEmp.EmployeeType = hremployee.EmployeeType;
                        hrEmp.Prefix = hremployee.Prefix;
                        hrEmp.FullName = hremployee.FullName;
                        hrEmp.ArFullName = hremployee.ArFullName;
                        hrEmp.IsEmployee = hremployee.IsEmployee;
                        hrEmp.Credential = hremployee.Credential;
                        hrEmp.Nic = hremployee.Nic;
                        hrEmp.CityId = hremployee.CityID;
                        hrEmp.CountryId = hremployee.CountryID;
                        hrEmp.StateId = hremployee.StateID;
                        hrEmp.ZipCode = hremployee.ZipCode;
                        hrEmp.CellNo = hremployee.CellNo;
                        hrEmp.Phone = hremployee.Phone;
                        hrEmp.Email = hremployee.Email;
                        hrEmp.Fax = hremployee.Fax;
                        hrEmp.Gender = hremployee.Gender;
                        hrEmp.DriversLicenseNo = hremployee.DriversLicenseNo;
                        hrEmp.DriversLicenseNo = hremployee.DriversLicenseNo;
                        hrEmp.Dob = hremployee.DOB;
                        hrEmp.BloodGroup = hremployee.BloodGroup;
                        hrEmp.MaritalStatus = hremployee.MaritalStatus;
                        hrEmp.Active = hremployee.Active;
                        hrEmp.UserName = hremployee.UserName;
                        // hrEmp.Password = pwdHash2;
                        hrEmp.HomeAddress1 = hremployee.HomeAddress1;
                        hrEmp.HomeAddress2 = hremployee.HomeAddress2;
                        hrEmp.IsAdmin = hremployee.IsAdmin;
                        hrEmp.HomePager = hremployee.HomePager;
                        hrEmp.EmerRelationship = hremployee.EmerRelationship;
                        hrEmp.EmerFullName = hremployee.EmerFullName;
                        hrEmp.EmerAddress1 = hremployee.EmerAddress1;
                        hrEmp.EmerAddress2 = hremployee.EmerAddress2;
                        hrEmp.EmerCountryId = hremployee.EmerCountryId;
                        hrEmp.EmerStateId = hremployee.EmerStateId;
                        hrEmp.EmerCityId = hremployee.EmerCityId;
                        hrEmp.EmerZipCode = hremployee.EmerZipCode;
                        hrEmp.EmerEmail = hremployee.EmerEmail;
                        hrEmp.EmerCellPhone = hremployee.CellNo;
                        hrEmp.EmerPager = hremployee.EmerPager;
                        hrEmp.EmerFax = hremployee.EmerFax;
                        hrEmp.UserPicture = hremployee.UserPicture;
                        hrEmp.ProvRemAddress2 = hremployee.ProvRemAddress2;
                        hrEmp.ProvStateLicNo = hremployee.ProvStateLicNo;
                        hrEmp.ProvDeaNo = hremployee.ProvDeaNo;
                        hrEmp.ProvNpi = hremployee.ProvNPI;
                        hrEmp.ProvTaxonomy = hremployee.ProvTaxonomy;
                        //hrEmp.IsPerson=emp.IsPerson;
                        hrEmp.IsRefProvider = hremployee.IsRefProvider;
                        hrEmp.PasswordResetByAdmin = hremployee.PasswordResetByAdmin;
                        hrEmp.PasswordUpdatedDate = hremployee.PasswordUpdatedDate;
                        hrEmp.Initials = hremployee.Initials;
                        hrEmp.Email = hremployee.Email;
                        hrEmp.Dhcccode = hremployee.DHCCCode;
                        hrEmp.ProviderSpid = hremployee.ProviderSPID;
                        hrEmp.VippatientAccess = hremployee.VIPPatientAccess;
                        hrEmp.JoiningDate = hremployee.JoiningDate;
                        hrEmp.AllowChgCap = hremployee.AllowChgCap;
                        hrEmp.ErxPass = hremployee.ErxPass;
                        hrEmp.HaadLicType = hremployee.HaadLicType;
                        hrEmp.DrCashPrice = hremployee.DrCashPrice;
                        hrEmp.GrantAccessToMalaffi = hremployee.GrantAccessToMalaffi;
                        hrEmp.MalaffiRoleLevel = Convert.ToByte(hremployee.MalaffiRoleLevel);
                        hrEmp.EnableMbr = hremployee.EnableMBR;
                        hrEmp.CreatedOn = DateTime.Now;
                        //  hrEmp.CreatedBy = hremployee.CreatedBy;
                        hrEmp.UpdatedOn = hremployee.UpdatedOn;
                        hrEmp.UpdatedBy = hremployee.UpdatedBy;
                        hrEmp.PassPortNo = hremployee.PassPortNo;
                        hrEmp.BusAddress1 = hremployee.BusAddress1;
                        hrEmp.BusAddress2 = hremployee.BusAddress2;
                        hrEmp.BusCountryId = hremployee.BusCountryId;
                        hrEmp.BusCityId = hremployee.BusCityId;
                        hrEmp.BusStateId = hremployee.BusStateId;
                        hrEmp.BusZipCode = hremployee.BusZipCode;
                        hrEmp.BusEmail = hremployee.BusEmail;
                        hrEmp.BusPhone = hremployee.BusPhone;
                        hrEmp.BusCellPhone = hremployee.BusCellPhone;
                        hrEmp.BusPager = hremployee.BusPager;
                        hrEmp.BusFax = hremployee.BusFax;
                        hrEmp.DwellingNumber = hremployee.DwellingNumber;
                        hrEmp.BusDwellingNumber = hremployee.BusDwellingNumber;
                        hrEmp.EmerDwellingNumber = hremployee.EmerDwellingNumber;
                        hrEmp.BusEnitity = hremployee.BusEnitity;
                        hrEmp.IsDeleted = false;

                        _context.Hremployees.Update(hrEmp);


                        var hremployeeFacilities = _context.HremployeeFacilities
                            .Where(x => x.EmployeeId.Equals(hremployee.EmployeeId) && x.IsDeleted == false).ToList();
                        foreach (var facility in hremployeeFacilities)
                        {
                            var Removehremp = hremployeeFacilities.FirstOrDefault(x => x.EmployeeId == hremployee.EmployeeId && x.FacilityId == facility.FacilityId);
                            if (Removehremp != null)
                            {
                                _context.HremployeeFacilities.Remove(Removehremp);
                            }
                        }


                        foreach (var facility in hremployee.EmployeeFacility)
                        {
                            var hremp = _context.HremployeeFacilities.FirstOrDefault(x => x.EmployeeId == hremployee.EmployeeId && x.FacilityId == facility.FacilityID && x.IsDeleted == false);
                            if (hremp != null)
                            {
                                hremp.EmployeeId = facility.EmployeeId;
                                hremp.UpdatedBy = hremployee.CreatedBy;
                                hremp.FacilityId = facility.FacilityID;
                                hremp.CreatedOn = DateTime.Now;
                                hremp.IsDeleted = false;
                                _context.HremployeeFacilities.Update(hremp);
                            }
                            else
                            {
                                HremployeeFacility hr = new HremployeeFacility();
                                hr.EmployeeId = facility.EmployeeId;
                                hr.UpdatedBy = hremployee.CreatedBy;
                                hr.FacilityId = facility.FacilityID;
                                hr.CreatedOn = DateTime.Now;
                                hr.IsDeleted = false;
                                _context.HremployeeFacilities.Add(hr);
                            }
                        }
                        await _context.SaveChangesAsync();


                        var hrLicenseInfos = _context.HrlicenseInfos
                            .Where(x => x.EmployeeId.Equals(hremployee.EmployeeId) && x.IsDeleted == false).ToList();

                        foreach (var license in hremployee.LicenseInfo)
                        {
                            var hrLicenseInfoToUpdate = hrLicenseInfos.FirstOrDefault(x => x.EmployeeId == hremployee.EmployeeId);
                            if (hrLicenseInfoToUpdate != null)
                            {
                                hrLicenseInfoToUpdate.Active = license.Active;
                                hrLicenseInfoToUpdate.LicenseName = license.LicenseName;
                                hrLicenseInfoToUpdate.LicenseNo = license.LicenseNo;
                                hrLicenseInfoToUpdate.ExpiryDate = license.ExpiryDate;
                                hrLicenseInfoToUpdate.EmployeeId = license.EmployeeId;
                                hrLicenseInfoToUpdate.IsDeleted = false;

                                _context.HrlicenseInfos.Update(hrLicenseInfoToUpdate);
                            }
                        }

                        await _context.SaveChangesAsync();

                            

                        var secEmpRoles = _context.SecEmployeeRoles
                            .Where(x => x.EmployeeId.Equals(hremployee.EmployeeId) && x.IsDeleted == false).ToList();

                        foreach (var empRole in hremployee.EmployeeRole)
                        {
                            var secEmpRoleToUpdate = secEmpRoles.FirstOrDefault(x => x.EmployeeId == hremployee.EmployeeId);
                            if (secEmpRoleToUpdate != null)
                            {
                                secEmpRoleToUpdate.EmployeeId = empRole.EmployeeId;
                                secEmpRoleToUpdate.UpdatedBy = hremployee.CreatedBy;
                                secEmpRoleToUpdate.CreatedOn = DateTime.Now;
                                secEmpRoleToUpdate.IsDeleted = false;

                                _context.SecEmployeeRoles.Update(secEmpRoleToUpdate);
                            }
                        }

                        await _context.SaveChangesAsync();


                    }
                    return "true";

                }
                else if (!exist)
                {

                    DTOs.ControlPanel.Hremployee emp = new DTOs.ControlPanel.Hremployee();
                    emp = hremployee;

                    Core.Entities.Hremployee hrEmp1 = new Core.Entities.Hremployee();

                    hrEmp1.EmployeeType = emp.EmployeeType;
                    hrEmp1.Prefix = emp.Prefix;
                    hrEmp1.FullName = emp.FullName;
                    hrEmp1.ArFullName = emp.ArFullName;
                    hrEmp1.IsEmployee = emp.IsEmployee;
                    hrEmp1.Credential = emp.Credential;
                    hrEmp1.Nic = emp.Nic;
                    hrEmp1.CityId = emp.CityID;
                    hrEmp1.CountryId = emp.CountryID;
                    hrEmp1.StateId = emp.StateID;
                    hrEmp1.ZipCode = emp.ZipCode;
                    hrEmp1.CellNo = emp.CellNo;
                    hrEmp1.Phone = emp.Phone;
                    hrEmp1.Email = emp.Email;
                    hrEmp1.Fax = emp.Fax;
                    hrEmp1.Gender = emp.Gender;
                    hrEmp1.DriversLicenseNo = emp.DriversLicenseNo;
                    hrEmp1.Dob = emp.DOB;
                    hrEmp1.BloodGroup = emp.BloodGroup;
                    hrEmp1.MaritalStatus = emp.MaritalStatus;
                    hrEmp1.Active = emp.Active;
                    hrEmp1.UserName = emp.UserName;
                    hrEmp1.Password = pwdHash2;
                    hrEmp1.HomeAddress1 = emp.HomeAddress1;
                    hrEmp1.HomeAddress2 = emp.HomeAddress2;
                    hrEmp1.IsAdmin = emp.IsAdmin;
                    hrEmp1.HomePager = emp.HomePager;
                    hrEmp1.EmerRelationship = emp.EmerRelationship;
                    hrEmp1.EmerFullName = emp.EmerFullName;
                    hrEmp1.EmerAddress1 = emp.EmerAddress1;
                    hrEmp1.EmerAddress2 = emp.EmerAddress2;
                    hrEmp1.EmerCountryId = emp.EmerCountryId;   
                    hrEmp1.EmerStateId = emp.EmerStateId;
                    hrEmp1.EmerCityId = emp.EmerCityId;
                    hrEmp1.EmerZipCode = emp.EmerZipCode;
                    hrEmp1.EmerEmail = emp.EmerEmail;
                    hrEmp1.EmerCellPhone = emp.CellNo;
                    hrEmp1.EmerPager = emp.EmerPager;
                    hrEmp1.EmerFax = emp.EmerFax;
                    hrEmp1.UserPicture = emp.UserPicture;
                    hrEmp1.ProvRemAddress2 = emp.ProvRemAddress2;
                    hrEmp1.ProvStateLicNo = emp.ProvStateLicNo;
                    hrEmp1.ProvDeaNo = emp.ProvDeaNo;
                    hrEmp1.ProvNpi = emp.ProvNPI;
                    hrEmp1.ProvTaxonomy = emp.ProvTaxonomy;
                    if (emp.IsPerson == "true")
                    {
                        hrEmp1.IsPerson = "1";
                    }
                    else
                    {
                        hrEmp1.IsPerson = "0";
                    }
                    hrEmp1.IsRefProvider = emp.IsRefProvider;
                    hrEmp1.PasswordResetByAdmin = emp.PasswordResetByAdmin;
                    hrEmp1.PasswordUpdatedDate = emp.PasswordUpdatedDate;
                    hrEmp1.Initials = emp.Initials;
                    hrEmp1.Email = emp.Email;
                    hrEmp1.Dhcccode = emp.DHCCCode;
                    hrEmp1.ProviderSpid = emp.ProviderSPID;
                    hrEmp1.VippatientAccess = emp.VIPPatientAccess;
                    hrEmp1.JoiningDate = emp.JoiningDate;
                    hrEmp1.AllowChgCap = emp.AllowChgCap;
                    hrEmp1.ErxPass = emp.ErxPass;
                    hrEmp1.HaadLicType = emp.HaadLicType;
                    hrEmp1.DrCashPrice = emp.DrCashPrice;
                    hrEmp1.GrantAccessToMalaffi = emp.GrantAccessToMalaffi;
                    hrEmp1.MalaffiRoleLevel = Convert.ToByte(emp.MalaffiRoleLevel);
                    hrEmp1.EnableMbr = emp.EnableMBR;
                    hrEmp1.CreatedOn = DateTime.Now;
                    hrEmp1.CreatedBy = emp.CreatedBy;
                    hrEmp1.UpdatedOn = emp.UpdatedOn;
                    hrEmp1.UpdatedBy = emp.UpdatedBy;
                    hrEmp1.PassPortNo = emp.PassPortNo;
                    hrEmp1.BusAddress1 = emp.BusAddress1;
                    hrEmp1.BusAddress2 = emp.BusAddress2;
                    hrEmp1.BusCountryId = emp.BusCountryId;
                    hrEmp1.BusCityId = emp.BusCityId;
                    hrEmp1.BusStateId = emp.BusStateId;
                    hrEmp1.BusZipCode = emp.BusZipCode;
                    hrEmp1.BusEmail = emp.BusEmail;
                    hrEmp1.BusPhone = emp.BusPhone;
                    hrEmp1.BusCellPhone = emp.BusCellPhone;
                    hrEmp1.BusPager = emp.BusPager;
                    hrEmp1.BusFax = emp.BusFax;
                    hrEmp1.DwellingNumber = emp.DwellingNumber;
                    hrEmp1.BusDwellingNumber = emp.BusDwellingNumber;
                    hrEmp1.EmerDwellingNumber = emp.EmerDwellingNumber;
                    hrEmp1.BusEnitity = emp.BusEnitity;
                    hrEmp1.IsDeleted = false;

                    _context.Hremployees.Add(hrEmp1);
                    await _context.SaveChangesAsync();

                    long hrEmployeeId = hrEmp1.EmployeeId;


                    var hremployeeFacilities = _context.HremployeeFacilities
                             .Where(x => x.EmployeeId.Equals(hrEmployeeId) && x.IsDeleted == false).ToList();
                    foreach (var facility in hremployeeFacilities)
                    {
                        var Removehremp = hremployeeFacilities.FirstOrDefault(x => x.EmployeeId == hrEmployeeId && x.FacilityId == facility.FacilityId);
                        if (Removehremp != null)
                        {
                            _context.HremployeeFacilities.Remove(Removehremp);
                        }
                    }


                    foreach (var facility in hremployee.EmployeeFacility)
                    {
                        var hremp = _context.HremployeeFacilities.FirstOrDefault(x => x.EmployeeId == hrEmployeeId && x.FacilityId == facility.FacilityID && x.IsDeleted == false);
                        if (hremp != null)
                        {
                            hremp.EmployeeId = hrEmployeeId;
                            hremp.UpdatedBy = hremployee.CreatedBy;
                            hremp.FacilityId = facility.FacilityID;
                            hremp.CreatedOn = DateTime.Now;
                            hremp.IsDeleted = false;
                            _context.HremployeeFacilities.Update(hremp);
                        }
                        else
                        {
                            HremployeeFacility hr = new HremployeeFacility();
                            hr.EmployeeId = hrEmployeeId;
                            hr.UpdatedBy = hremployee.CreatedBy;
                            hr.FacilityId = facility.FacilityID;
                            hr.CreatedOn = DateTime.Now;
                            hr.IsDeleted = false;
                            _context.HremployeeFacilities.Add(hr);
                        }
                    }
                    await _context.SaveChangesAsync();

                    int a = 0;
                    if (emp.LicenseInfo.Count > 0)
                    {
                        foreach (var licenseInfo in emp.LicenseInfo)
                        {
                            if (licenseInfo.LicenseName != null)
                            {
                                a++;
                                Core.Entities.HrlicenseInfo hrLicenseInfo = new Core.Entities.HrlicenseInfo();

                                hrLicenseInfo.Active = licenseInfo?.Active ?? false;
                                hrLicenseInfo.LicenseName = licenseInfo?.LicenseName ?? string.Empty;
                                hrLicenseInfo.LicenseNo = licenseInfo?.LicenseNo ?? string.Empty;
                                hrLicenseInfo.ExpiryDate = licenseInfo?.ExpiryDate;
                                hrLicenseInfo.EmployeeId = hrEmployeeId;
                                hrLicenseInfo.IsDeleted = false;
                                _context.HrlicenseInfos.Add(hrLicenseInfo);

                            }
                        }
                        if (a > 0)
                        {
                            await _context.SaveChangesAsync();
                        }
                    }

                    foreach (var employeeRole in emp.EmployeeRole)
                    {
                        Core.Entities.SecEmployeeRole secEmpRole = new Core.Entities.SecEmployeeRole();

                        secEmpRole.EmployeeId = hrEmployeeId;
                        secEmpRole.RoleId = employeeRole?.RoleId ?? 0;
                        secEmpRole.CreatedBy = emp.CreatedBy;
                        secEmpRole.CreatedOn = DateTime.Now;
                        secEmpRole.IsDeleted = false;

                        _context.SecEmployeeRoles.Add(secEmpRole);
                    }

                    await _context.SaveChangesAsync();


                    return "true";


                }

                else
                {
                    return "false";
                }

            }
            catch (Exception ex)
            {

                return ex.Message.ToString();
            }

        }
        public async Task<DataSet> GetUserByIDDB(long EmployeeId)
        {
            try
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@EmployeeId", EmployeeId, DbType.Int64);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("CP_GetHREmployeeById", parameters);
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

        //Task<DataSet> SearchUserDB1
        //public async Task<DataSet> SearchUserDB1(string? FullName, int? Page = 1, int? Size = 100, string? SortColumn = "EmployeeId", string? SortOrder = "ASC")

        //{
        //    DynamicParameters param = new DynamicParameters();
        //    DataSet ds = new DataSet();
        //    try
        //    {
        //        param.Add("@FullName", FullName ?? (object)DBNull.Value, DbType.String);
        //        param.Add("@Page", Page, DbType.Int64);
        //        param.Add("@Size", Size, DbType.Int64);
        //        param.Add("@SortColumn", SortColumn, DbType.String);
        //        param.Add("@SortOrder", SortOrder, DbType.String);

        //        ds = await DapperHelper.GetDataSetBySPWithParams("CP_SearchHREmployee1", param);
        //        if (ds.Tables[0].Rows.Count == 0)
        //        {
        //            throw new Exception("No data exist");
        //        }

        //    }
        //    catch (Exception ex)
        //    {

        //        // throw ex;
        //    }

        //    return ds;

        //}
        public async Task<DataSet> FilterUsersDb(string? FullName, string? Gender, string? Phone, string? CellNo, DateTime? JoiningDate, string? Email, int? EmployeeType, int? Page = 1, int? Size = 100)

        {
            DynamicParameters param = new DynamicParameters();
            DataSet ds = new DataSet();
            try
            {
                param.Add("@FullName", FullName, DbType.String);
                param.Add("@Gender", Gender, DbType.String);
                param.Add("@JoiningDate", JoiningDate, DbType.Date);
                param.Add("@Employeetype", EmployeeType, DbType.Int64);
                param.Add("@Email", Email, DbType.String);
                param.Add("@Phone", Phone, DbType.String);
                param.Add("@CellNo", CellNo, DbType.String);
                param.Add("@Page", Page, DbType.Int64);
                param.Add("@Size", Size, DbType.Int64);

                ds = await DapperHelper.GetDataSetBySPWithParams("CP_SearchHREmployee", param);
                if (ds.Tables[0].Rows.Count == 0)
                {
                    throw new Exception("No data exist");
                }

            }
            catch (Exception ex)
            {

                // throw ex;
            }

            return ds;

        }
        public async Task<DataSet> GetHREmployeeTypesDataSet()
        {
            var employeeTypes =  _context.HremployeeTypes
     .Select(x => new { x.TypeId, TypeDescription = x.TypeDescription.Trim() })
     .ToList();


            // Create a new DataSet
            DataSet dataSet = new DataSet();

             DataTable dataTable = new DataTable("EmployeeTypes");

             dataTable.Columns.Add("TypeId", typeof(int));
            dataTable.Columns.Add("TypeDescription", typeof(string));

             foreach (var employeeType in employeeTypes)
            {
                dataTable.Rows.Add(employeeType.TypeId, employeeType.TypeDescription);
            }

             dataSet.Tables.Add(dataTable);

             return dataSet;
        }



        public async Task<DataSet> SearchUserDB(string? FullName, string? Gender, string? Phone, string? CellNo, DateTime? JoiningDate, string? Email, int? EmployeeType, bool? Active, bool? isRefProvider, bool? IsEmployee, int? facilityId, int? Page = 1, int? Size = 100, string? SortColumn = "EmployeeId", string? SortOrder = "ASC")

                {
            DynamicParameters param = new DynamicParameters();
            DataSet ds = new DataSet();
            try
            {
                param.Add("@FullName", FullName, DbType.String);
                param.Add("@Gender", Gender, DbType.String);
                param.Add("@JoiningDate", JoiningDate, DbType.Date);
                param.Add("@Employeetype", EmployeeType, DbType.Int64);
                param.Add("@Email", Email, DbType.String);
                param.Add("@Phone", Phone, DbType.String);
                param.Add("@CellNo", CellNo, DbType.String);
                param.Add("@Active", Active, DbType.Boolean);
                param.Add("@isRefProvider", isRefProvider, DbType.Boolean);
                param.Add("@IsEmployee", IsEmployee, DbType.Boolean);
                param.Add("@facilityId", facilityId, DbType.Int64);
                param.Add("@Page", Page, DbType.Int64);
                param.Add("@Size", Size, DbType.Int64);
                param.Add("@SortColumn", SortColumn, DbType.String);
                param.Add("@SortOrder", SortOrder, DbType.String);
                ds = await DapperHelper.GetDataSetBySPWithParams("CP_SearchHREmployee", param);
                if (ds.Tables[0].Rows.Count == 0)
                {
                    throw new Exception("No data exist");
                }

            }
            catch (Exception ex)
            {

                // throw ex;
            }

            return ds;

        }

        public async Task<DataSet> SearchUserDBWithpagination(FilterUserList req){
            DynamicParameters param = new DynamicParameters();
            DataSet ds = new DataSet();
            try
            {
                int? a = null;
                if (req.UserList.active == "true" && req.UserList.active !=null) 
                {
                    a = 1;
                }
                if (req.UserList.email == "")
                {
                    req.UserList.email = null;
                }
                if (req.UserList.name == "" )
                {
                    req.UserList.name = null;
                }
                param.Add("@FullName", req.UserList.name, DbType.String);
                param.Add("@Gender", req.UserList.genderId, DbType.String);
                param.Add("@JoiningDate", req.UserList.joiningDate, DbType.String);
                param.Add("@Employeetype", req.UserList.employeeType, DbType.Int64); 

                param.Add("@facilityId", req.UserList.facilityId, DbType.Int64);
                param.Add("@Email", req.UserList.email, DbType.String);
                param.Add("@CellNo", req.UserList.cellNo, DbType.String);
                param.Add("@Active", a, DbType.Boolean);
                param.Add("@Page", req.PaginationInfo.Page, DbType.Int64);
                param.Add("@Size", req.PaginationInfo.RowsPerPage, DbType.Int64);
                ds = await DapperHelper.GetDataSetBySPWithParams("CP_SearchHREmployee_with_pagination", param);
                if (ds.Tables[0].Rows.Count == 0)
                {
                    return null;
                }

            }
            catch (Exception ex)
            {

                return new DataSet();
            }

            return ds;

        }


        public async Task<bool> Delete(long employeeId)
        {
            DynamicParameters param = new DynamicParameters();

            try
            {
                param.Add("@EmployeeId", employeeId, DbType.Int64);



                bool result = await DapperHelper.ExcecuteSPByParams("CP_DeleteHREmployee", param);

                return result;
            }
            catch (Exception ex)
            {

                return false;
            }


        }



        public async Task<bool> DeleteLicense(long HRlicenseID)
        {
            DynamicParameters param = new DynamicParameters();

            try
            {
                param.Add("@HRlicenseID", HRlicenseID, DbType.Int64);



                bool result = await DapperHelper.ExcecuteSPByParams("CP_DeleteHRLicense", param);

                return result;
            }
            catch (Exception ex)
            {

                return false;

            }


        }
        public async Task<string> UpdateUserDB(DTOs.ControlPanel.Hremployee hremp)
        {

            try
            {

                DataTable EmployeeFacilityDT = ConversionHelper.ToDataTable(hremp.EmployeeFacility);

                DataTable LicenseInfoDT = ConversionHelper.ToDataTable(hremp.LicenseInfo);

                DataTable SecEmployeeRoleDT = ConversionHelper.ToDataTable(hremp.EmployeeRole);
                DTOs.ControlPanel.Hremployee EMP = new DTOs.ControlPanel.Hremployee();
                EMP = hremp;

                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("EmployeeId", EMP.EmployeeId, DbType.Int64);

                parameters.Add("EmployeeType", EMP.EmployeeType, DbType.Int64);

                parameters.Add("FullName", EMP.FullName, DbType.String);

                parameters.Add("ArFullName", EMP.ArFullName, DbType.String);

                parameters.Add("IsEmployee", EMP.IsEmployee, DbType.Boolean);

                parameters.Add("Credential", EMP.Credential, DbType.String);

                parameters.Add("Nic", EMP.Nic, DbType.String);

                parameters.Add("CityID", EMP.CityID, DbType.Int64);

                parameters.Add("CountryID", EMP.CountryID, DbType.Int64);

                parameters.Add("StateID", EMP.StateID, DbType.String);

                parameters.Add("ZipCode", EMP.ZipCode, DbType.String);

                parameters.Add("CellNo", EMP.CellNo, DbType.String);

                parameters.Add("Phone", EMP.Phone, DbType.String);

                parameters.Add("Fax", EMP.Fax, DbType.String);

                parameters.Add("DriversLicenseNo", EMP.DriversLicenseNo, DbType.String);

                parameters.Add("DOB", EMP.DOB, DbType.DateTime);

                parameters.Add("Gender", EMP.Gender, DbType.String);

                parameters.Add("BloodGroup", EMP.BloodGroup, DbType.String);

                parameters.Add("MaritalStatus", EMP.MaritalStatus, DbType.String);

                parameters.Add("Active", EMP.Active, DbType.Boolean);

                parameters.Add("UserName", EMP.UserName, DbType.String);

                parameters.Add("Password", EMP.Password, DbType.String);

                parameters.Add("HomeAddress1", EMP.HomeAddress1, DbType.String);

                parameters.Add("HomeAddress2", EMP.HomeAddress2, DbType.String);

                parameters.Add("IsAdmin", EMP.IsAdmin, DbType.Boolean);

                parameters.Add("HomePager", EMP.HomePager, DbType.String);

                parameters.Add("EmerRelationship", EMP.EmerRelationship, DbType.String);

                parameters.Add("EmerFullName", EMP.EmerFullName, DbType.String);

                parameters.Add("EmerAddress1", EMP.EmerAddress1, DbType.String);

                parameters.Add("EmerAddress2", EMP.EmerAddress2, DbType.String);

                parameters.Add("EmerCountryId", EMP.EmerCountryId, DbType.Int64);

                parameters.Add("EmerStateId", EMP.EmerStateId, DbType.Int64);

                parameters.Add("EmerCityId", EMP.EmerCityId, DbType.Int64);

                parameters.Add("EmerZipCode", EMP.EmerZipCode, DbType.String);

                parameters.Add("EmerPhone", EMP.EmerPhone, DbType.String);

                parameters.Add("EmerCellPhone", EMP.EmerCellPhone, DbType.String);

                parameters.Add("EmerPager", EMP.EmerPager, DbType.String);

                parameters.Add("EmerFax", EMP.EmerFax, DbType.String);

                parameters.Add("IsPerson", EMP.IsPerson, DbType.String);

                parameters.Add("IsRefProvider", EMP.IsRefProvider, DbType.Boolean);

                parameters.Add("VIPPatientAccess", EMP.VIPPatientAccess, DbType.Boolean);

                parameters.Add("JoiningDate", EMP.JoiningDate, DbType.DateTime);

                parameters.Add("PassPortNo", EMP.PassPortNo, DbType.String);

                parameters.Add("BusAddress1", EMP.BusAddress1, DbType.String);

                parameters.Add("BusAddress2", EMP.BusAddress2, DbType.String);

                parameters.Add("BusCountryId", EMP.BusCountryId, DbType.Int64);

                parameters.Add("BusCityId", EMP.BusCityId, DbType.Int64);

                parameters.Add("BusStateId", EMP.BusStateId, DbType.Int64);

                parameters.Add("BusZipCode", EMP.BusZipCode, DbType.String);

                parameters.Add("BusPhone", EMP.BusPhone, DbType.String);

                parameters.Add("BusCellPhone", EMP.BusCellPhone, DbType.String);

                parameters.Add("BusPager", EMP.BusPager, DbType.String);

                parameters.Add("BusFax", EMP.BusFax, DbType.String);

                parameters.Add("@HREmployeeFacilityTypeVar", EmployeeFacilityDT, DbType.Object);

                parameters.Add("@HRLicenseInfoTypeVar", LicenseInfoDT, DbType.Object);

                parameters.Add("@SecEmployeeRoleTypeVar", SecEmployeeRoleDT, DbType.Object);

                bool res = await DapperHelper.ExcecuteSPByParams("CP_UpdateHREmployee", parameters);

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

        public async Task<DataSet> GetLicenseByID(long HRlicenseID)
        {
            try
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@HRlicenseID", HRlicenseID, DbType.Int32);

                //DataSet ds = await DapperHelper.GetDataSetBySP("GetEmployeesById", EmployeeId);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("CP_GetLicenseByID", parameters);

                if (ds.Tables[0].Rows.Count == 0)
                {
                    throw new Exception("No data exist of such ID");
                }

                return ds;
            }
            catch (Exception ex)
            {
                // Handle the exception as necessary
                // Console.WriteLine($"An error occurred: {ex.Message}");
                // or throw a different exception, log the error, etc.
                return new DataSet();
            }
        }
        //public async Task<DataSet> SearchUserDBWithpagination(FilterUserList req)
        //{
        //    DynamicParameters param = new DynamicParameters();
        //    DataSet ds = new DataSet();
        //    try
        //    {
        //        int? a = null;
        //        if (req.UserList.active == "true" && req.UserList.active != null)
        //        {
        //            a = 1;
        //        }
        //        param.Add("@FullName", req.UserList.name, DbType.String);
        //        param.Add("@Gender", req.UserList.genderId, DbType.String);
        //        param.Add("@JoiningDate", req.UserList.joiningDate, DbType.String);
        //        param.Add("@Employeetype", req.UserList.employeeType, DbType.Int64);
        //        param.Add("@facilityId", req.UserList.facilityId, DbType.Int64);
        //        param.Add("@Email", req.UserList.email, DbType.String);
        //        param.Add("@CellNo", req.UserList.cellNo, DbType.String);
        //        param.Add("@Active", a, DbType.Boolean);
        //        param.Add("@Page", req.PaginationInfo.Page, DbType.Int64);
        //        param.Add("@Size", req.PaginationInfo.RowsPerPage, DbType.Int64);
        //        ds = await DapperHelper.GetDataSetBySPWithParams("CP_SearchHREmployee_with_pagination", param);
        //        if (ds.Tables[0].Rows.Count == 0)
        //        {
        //            return null;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return new DataSet();
        //    }
        //    return ds;
        //}
    }
}
