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
using HMIS.Application.DTOs.Demographics;
using static HMIS.Application.DTOs.SpLocalModel.DemographicListModel;

namespace HMIS.Application.ServiceLogics
{
    public class DemographicManager : IDemographicManager
    {
        private readonly HMISDbContext _context;
        public DemographicManager(HMISDbContext context)
        {
            _context = context;
        }

        public async Task<DataSet> GetDemoByMRNoDB(string MRNo)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@MRNo", MRNo, DbType.String);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("REG_GetDemographic", param);
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


        public async Task<DataSet> GetHistoryByMRNoDB(string MRNo)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@MRNo", MRNo, DbType.String);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("REG_GetUniquePatientOld", param);
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

        public async Task<bool> DeleteDemographicDB(int PatientId)
        {
            var findResult = await Task.Run(() => _context.RegPatients.Include(x => x.RegPatientEmployers).Include(x => x.RegAccounts).Include(x => x.RegPatientDetails).Where(x => x.PatientId.Equals(PatientId) && x.IsDeleted == false).FirstOrDefaultAsync());
            if (findResult != null)
            {
                findResult.IsDeleted = true;
                foreach (var item in findResult.RegPatientEmployers)
                {
                    item.IsDeleted = true;
                    //findResult.RegPatientEmployers.Add(item);
                }
                foreach (var item1 in findResult.RegAccounts)
                {
                    item1.IsDeleted = false;
                    //findResult.RegAccounts.Add(item1);
                }
                foreach (var item2 in findResult.RegPatientDetails)
                {
                    item2.IsDeleted = false;
                    //findResult.RegPatientDetails.Add(item2);
                }
                _context.RegPatients.Update(findResult);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> UpdateDemographicDB(RegInsert regUpdate)
        {
            try

            {
                var findResult = await Task.Run(() => _context.RegPatients.Include(x=>x.RegPatientEmployers).Include(x=>x.RegAccounts).Include(x=>x.RegPatientDetails).Where(x => x.PatientId.Equals(regUpdate.PatientId) && x.IsDeleted == false).FirstOrDefaultAsync());

                if (findResult != null)
                {
                    findResult.Mrno = findResult.Mrno;
                    findResult.PersonTitleId = (byte?)regUpdate.PersonTitleId;
                    findResult.PersonFirstName = regUpdate.PersonFirstName;
                    findResult.PersonMiddleName = regUpdate.PersonMiddleName;
                    findResult.PersonLastName = regUpdate.PersonLastName;
                    findResult.PersonNameArabic = regUpdate.PersonNameArabic;
                    findResult.PersonSex = regUpdate.PersonSexId;
                    findResult.PersonMaritalStatus = regUpdate.PersonMaritalStatus;
                    findResult.PatientBirthDate = regUpdate.PatientBirthDate;
                    findResult.PatientBloodGroupId = regUpdate.PatientBloodGroupId;
                    findResult.Nationality = regUpdate.Nationality;
                    findResult.PrimaryLanguage = regUpdate.PrimaryLanguage;
                    findResult.Religion = regUpdate.Religion;
                    findResult.PersonEthnicityTypeId = regUpdate.PersonEthnicityTypeId;
                    findResult.EmiratesIdn = regUpdate.EmiratesIDN;
                    findResult.PersonSocialSecurityNo = regUpdate.PersonSocialSecurityNo;
                    findResult.PersonPassportNo = regUpdate.PersonPassportNo;
                    findResult.PersonDriversLicenseNo = regUpdate.PersonDriversLicenseNo;
                    findResult.LaborCardNo = regUpdate.LaborCardNo;
                    findResult.Vippatient = regUpdate.VIPPatient;
                    findResult.PatientPicture = regUpdate.PatientPicture;
                    findResult.ResidenceVisaNo = regUpdate.ResidenceVisaNo;
                    findResult.Empi = regUpdate.EMPI;
                    findResult.MediaChannelId = regUpdate.MediaChannelId;
                    findResult.MediaItemId = regUpdate.MediaItemId;
                    findResult.TabsTypeId = regUpdate.TabsTypeId;
                    findResult.IsDeleted = false;
                    findResult.Practice = regUpdate.Practice;
                    findResult.BillingNote = regUpdate.BillingNote;
                    findResult.GenderIdentity = regUpdate.GenderIdentity;
                    findResult.AdvDirective = regUpdate.AdvDirective;
                    findResult.Pregnant = regUpdate.Pregnant;
                    findResult.DrugHistConsent = regUpdate.DrugHistConsent;
                    findResult.ExemptReporting = regUpdate.ExemptReporting;
                    findResult.DateofDeath = regUpdate.DateofDeath;
                    findResult.CauseofDeath = regUpdate.CauseofDeath;
                    findResult.PreferredName = regUpdate.PreferredName;
                    findResult.PrimarycarephysicianPcp = regUpdate.PrimarycarephysicianPcp;
    
                    foreach (var item in regUpdate.regPatientEmployer)
                    {

                        Core.Entities.RegPatientEmployer regPatientEmployer = new Core.Entities.RegPatientEmployer()
                        {
                            Mrno = findResult.Mrno,
                            EmploymentTypeId = item.EmploymentTypeId,
                            EmploymentStatusId = item.EmploymentStatusId,
                            EmploymentCompanyName = item.EmploymentCompanyName,
                            EmploymentOccupationId = (byte?)item.EmploymentOccupationId,
                            IsDeleted = false,

                        };
                        findResult.RegPatientEmployers.Add(regPatientEmployer);
                    }
                    foreach (var item1 in regUpdate.regAccount)
                    {
                        Core.Entities.RegAccount regAccount = new Core.Entities.RegAccount()
                        {
                            Mrno = findResult.Mrno,
                            TypeId = item1.TypeId,
                            MasterAccountNo = item1.MasterAccountNo,
                            AccountNo = findResult.Mrno,
                            RelationshipId = item1.RelationshipId,
                            IsDeleted = false,
                        };
                        findResult.RegAccounts.Add(regAccount);
                    }

                    //foreach (var item2 in regUpdate.regPatientDetails)
                    //{
                    Core.Entities.RegPatientDetail contact = new Core.Entities.RegPatientDetail()
                    {

                        StreetName = regUpdate.Contact.StreetName,
                        DwellingNumber = regUpdate.Contact.DwellingNumber,
                        CountryId = regUpdate.Contact.CountryId,
                        StateId = regUpdate.Contact.StateId,
                        CityId = regUpdate.Contact.CityId,
                        PostalCode = regUpdate.Contact.PostalCode,
                        CellPhone = regUpdate.Contact.CellPhone,
                        HomePhone = regUpdate.Contact.HomePhone,
                        WorkPhone = regUpdate.Contact.WorkPhone,
                        Email = regUpdate.Contact.Email,
                        Fax = regUpdate.Contact.Fax,
                        IsDeleted = false,
                        TabsTypeId = regUpdate.Contact.TabsTypeId,
                        };
                        findResult.RegPatientDetails.Add(contact);

                    Core.Entities.RegPatientDetail employment = new Core.Entities.RegPatientDetail()
                    {
                        Company = regUpdate.Employment.company,
                        SectorOccupationId = regUpdate.Employment.sector_occupationId,
                        EmploymentStatusId = regUpdate.Employment.employmentsStatusId,
                        EmploymentTypeId = regUpdate.Employment.employmentTypeId,
                        TabsTypeId = regUpdate.Employment.TabsTypeId,
                       
                    };
                    findResult.RegPatientDetails.Add(employment);

                    Core.Entities.RegPatientDetail emergencycontact = new Core.Entities.RegPatientDetail()
                    {
                        RelationshipId = regUpdate.EmergencyContact.relationshipId,
                        FirstName = regUpdate.EmergencyContact.firstName,
                        MiddleName = regUpdate.EmergencyContact.middleName,
                        LastName = regUpdate.EmergencyContact.lastName,
                        StreetName = regUpdate.EmergencyContact.streetName,
                        DwellingNumber = regUpdate.EmergencyContact.dwellingNumber,
                        CountryId = regUpdate.EmergencyContact.countryId,
                        StateId = regUpdate.EmergencyContact.stateId,
                        CityId = regUpdate.EmergencyContact.cityId,
                        PostalCode = regUpdate.EmergencyContact.postalCode,
                        CellPhone = regUpdate.EmergencyContact.cellPhone.ToString(),
                        HomePhone = regUpdate.EmergencyContact.homePhone.ToString(),
                        WorkPhone = regUpdate.EmergencyContact.workPhone.ToString(),
                        TabsTypeId = regUpdate.EmergencyContact.TabsTypeId,
                    };
                    findResult.RegPatientDetails.Add(emergencycontact);

                    Core.Entities.RegPatientDetail nextOfKin = new Core.Entities.RegPatientDetail()
                    {
                        RelationshipId = regUpdate.NextOfKin.relationshipId,
                        FirstName = regUpdate.NextOfKin.firstName,
                        MiddleName = regUpdate.NextOfKin.middleName,
                        LastName = regUpdate.NextOfKin.lastName,
                        StreetName = regUpdate.NextOfKin.streetName,
                        DwellingNumber = regUpdate.NextOfKin.NokdwellingNumber.ToString(),
                        CountryId = regUpdate.NextOfKin.countryId,
                        StateId = regUpdate.NextOfKin.stateId,
                        CityId = regUpdate.NextOfKin.cityId,
                        PostalCode = regUpdate.NextOfKin.postalCode.ToString(),
                        CellPhone = regUpdate.NextOfKin.cellPhone.ToString(),
                        HomePhone = regUpdate.NextOfKin.homePhone.ToString(),
                        WorkPhone = regUpdate.NextOfKin.workPhone.ToString(),
                        TabsTypeId = regUpdate.NextOfKin.TabsTypeId,
                    };
                     findResult.RegPatientDetails.Add(nextOfKin);

                    Core.Entities.RegPatientDetail spouse = new Core.Entities.RegPatientDetail()
                    {
                        FirstName = regUpdate.Spouse.firstName,
                        MiddleName = regUpdate.Spouse.middleName,
                        LastName = regUpdate.Spouse.lastName,
                        GenderId = regUpdate.Spouse.genderId,
                        TabsTypeId = regUpdate.Spouse.TabsTypeId,

                    };
                    findResult.RegPatientDetails.Add(spouse);

                    Core.Entities.RegPatientDetail parent = new Core.Entities.RegPatientDetail()
                    {
                        FirstName = regUpdate.Parent.firstName,
                        MiddleName = regUpdate.Parent.middleName,
                        LastName = regUpdate.Parent.lastName,
                        HomePhone = regUpdate.Parent.homePhone.ToString(),
                        CellPhone = regUpdate.Parent.cellPhone.ToString(),
                        Email = regUpdate.Parent.email,
                        MotherFirstName = regUpdate.Parent.motherFirstName,
                        MotherMiddleName = regUpdate.Parent.mothermiddleName,
                        MotherLastName = regUpdate.Parent.motherLastName,
                        MotherHomePhone = regUpdate.Parent.motherHomePhone.ToString(),
                        MotherCellPhone = regUpdate.Parent.motherCellPhone.ToString(),
                        MotherEmail = regUpdate.Parent.motherEmail.ToString(),
                        TabsTypeId = regUpdate.Parent.TabsTypeId,
                    };
                    findResult.RegPatientDetails.Add(parent);

                    Core.Entities.RegPatientDetail assigment = new Core.Entities.RegPatientDetail()
                    {
                        ProofOfIncome = regUpdate.Assignments.proofOfIncome,
                        ProviderId = regUpdate.Assignments.providerId,
                        FinancialClassId = regUpdate.Assignments.financialClassId,
                        LocationId = regUpdate.Assignments.locationId,
                        SiteId = regUpdate.Assignments.siteId,
                        SignedDate = regUpdate.Assignments.signedDate,
                        UnSignedDate = regUpdate.Assignments.unsignedDate,
                        EntityTypeId = regUpdate.Assignments.entityTypeId,
                        EntityNameId = regUpdate.Assignments.entityNameId,
                        ReferredById = regUpdate.Assignments.referredById,
                        TabsTypeId = regUpdate.Assignments.TabsTypeId,
                    };
                    findResult.RegPatientDetails.Add(assigment);

                    Core.Entities.RegPatientDetail familyMember = new Core.Entities.RegPatientDetail()
                    {
                        MrNo = regUpdate.FamilyMembers.mrNo.ToString(),
                        AccountTypeId = regUpdate.FamilyMembers.accountTypeId,
                        MasterMrNo = regUpdate.FamilyMembers.masterMrNo.ToString(),
                        RelationshipId = regUpdate.FamilyMembers.relationshipId,
                        TabsTypeId = regUpdate.FamilyMembers.TabsTypeId,
                    };
                    findResult.RegPatientDetails.Add(familyMember);

                };
                _context.RegPatients.Update(findResult);
                    await _context.SaveChangesAsync();
                    return true;
                
                //DataTable RegPatientEmployerDT = ConversionHelper.ToDataTable(regUpdate.regPatientEmployer);

                //DataTable RegAccountDT = ConversionHelper.ToDataTable(regUpdate.regAccount);

                //DataTable RegPatientDetailsDT = ConversionHelper.ToDataTable(regUpdate.regPatientDetails);

                //RegInsert reg = new RegInsert();

                //reg = regUpdate;

                //DynamicParameters parameters = new DynamicParameters();

                //parameters.Add("@RegPatientID", reg.PatientId);
                //parameters.Add("@PersonFirstName", reg.PersonFirstName);
                //parameters.Add("@PersonMiddleName", reg.PersonMiddleName);
                //parameters.Add("@PersonLastName", reg.PersonLastName);
                //parameters.Add("@PersonTitleId", reg.PersonTitleId);
                //parameters.Add("@PersonSocialSecurityNo", reg.PersonSocialSecurityNo);
                //parameters.Add("@VIPPatient", reg.VIPPatient);
                //parameters.Add("@PersonSex", reg.PersonSexId);
                //parameters.Add("@PersonMaritalStatus", reg.PersonMaritalStatus);
                //parameters.Add("@PersonEthnicityTypeId", reg.PersonEthnicityTypeId);
                //parameters.Add("@PatientBirthDate", reg.PatientBirthDate);
                //parameters.Add("@PersonDriversLicenseNo", reg.PersonDriversLicenseNo);
                //parameters.Add("@PatientBloodGroupId", reg.PatientBloodGroupId);
                //parameters.Add("@PatientPicture", reg.PatientPicture);
                //parameters.Add("@ResidenceVisaNo", reg.ResidenceVisaNo);
                //parameters.Add("@LaborCardNo", reg.LaborCardNo);
                //parameters.Add("@Religion", reg.Religion);
                //parameters.Add("@PrimaryLanguage", reg.PrimaryLanguage);
                //parameters.Add("@Nationality", reg.Nationality);
                //parameters.Add("@EMPI", reg.EMPI);
                //parameters.Add("@MediaChannelId", reg.MediaChannelId);
                //parameters.Add("@MediaItemId", reg.MediaItemId);
                //parameters.Add("@EmiratesIDN", reg.EmiratesIDN);
                //parameters.Add("@UpdatedBy", reg.UpdatedBy);
                //parameters.Add("@PersonNameArabic", reg.PersonNameArabic);
                //parameters.Add("@TabsTypeId", reg.TabsTypeId);

                //parameters.Add("@RegPatientEmployerTypeVar", RegPatientEmployerDT, DbType.Object);

                //parameters.Add("@RegAccountTypeVar", RegAccountDT, DbType.Object);

                //parameters.Add("@RegDetailsTypeVar", RegPatientDetailsDT, DbType.Object);


                //bool res = await DapperHelper.ExcecuteSPByParams("REG_UpdateDemographic", parameters);


                //return res;


                return false;

            }
            catch (Exception ex)
            {
                return false;
            }

        }

        public async Task<DataSet> GetDemoByPatientId(string PatientId)
        {
            try
            {
                DynamicParameters param = new DynamicParameters();
                param.Add("@PatientId", PatientId, DbType.String);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("REG_GetDemographicById", param);
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
            
        public async Task<bool> InsertDemographicDB(RegInsert regInsert)
        {
            try
            {

                string newMrno = "0";
                var getLastMRNO = new RegLastMrno();
                if (regInsert != null && regInsert.PatientId == 0)
                {
                    getLastMRNO = await Task.Run(() => _context.RegLastMrnos.FirstOrDefaultAsync());
                    getLastMRNO.LastMrno = getLastMRNO.LastMrno + 1;
                    _context.Entry(getLastMRNO).State = EntityState.Modified;
                }
                RegPatient regPat = new RegPatient()
                {
                    Mrno = getLastMRNO.LastMrno.ToString(),
                    PersonTitleId = (byte?)regInsert.PersonTitleId,
                    PersonFirstName = regInsert.PersonFirstName,
                    PersonMiddleName = regInsert.PersonMiddleName,
                    PersonLastName = regInsert.PersonLastName,
                    PersonNameArabic = regInsert.PersonNameArabic,
                    PersonSex = regInsert.PersonSexId,
                    PersonMaritalStatus = regInsert.PersonMaritalStatus,
                    PatientBirthDate = regInsert.PatientBirthDate,
                    PatientBloodGroupId = regInsert.PatientBloodGroupId,
                    Nationality = regInsert.Nationality,
                    PrimaryLanguage = regInsert.PrimaryLanguage,
                    Religion = regInsert.Religion,
                    PersonEthnicityTypeId = regInsert.PersonEthnicityTypeId,
                    EmiratesIdn = regInsert.EmiratesIDN,
                    PersonSocialSecurityNo = regInsert.PersonSocialSecurityNo,
                    PersonPassportNo = regInsert.PersonPassportNo,
                    PersonDriversLicenseNo = regInsert.PersonDriversLicenseNo,
                    LaborCardNo = regInsert.LaborCardNo,
                    Vippatient = regInsert.VIPPatient,
                    PatientPicture = regInsert.PatientPicture,
                    ResidenceVisaNo = regInsert.ResidenceVisaNo,
                    Empi = regInsert.EMPI,
                    MediaChannelId = regInsert.MediaChannelId,
                    MediaItemId = regInsert.MediaItemId,
                    TabsTypeId = regInsert.TabsTypeId,
                    IsDeleted = false,
                    Practice = regInsert.Practice,
                    BillingNote = regInsert.BillingNote,
                    AdvDirective = regInsert.AdvDirective,
                    Pregnant = regInsert.Pregnant,
                    DrugHistConsent = regInsert.DrugHistConsent,
                    ExemptReporting = regInsert.ExemptReporting,
                    GenderIdentity = regInsert.GenderIdentity,
                    DateofDeath = regInsert.DateofDeath,
                    CauseofDeath = regInsert.CauseofDeath,
                    PreferredName = regInsert.PreferredName,
                    PrimarycarephysicianPcp = regInsert.PrimarycarephysicianPcp,
                    
                  
                };


                Core.Entities.RegPatientDetail contact = new Core.Entities.RegPatientDetail()
                {

                    StreetName = regInsert.Contact.StreetName,
                    DwellingNumber = regInsert.Contact.DwellingNumber,
                    CountryId = regInsert.Contact.CountryId,
                    StateId = regInsert.Contact.StateId,
                    CityId = regInsert.Contact.CityId,
                    PostalCode = regInsert.Contact.PostalCode,
                    CellPhone = regInsert.Contact.CellPhone,
                    HomePhone = regInsert.Contact.HomePhone,
                    WorkPhone = regInsert.Contact.WorkPhone,
                    Email = regInsert.Contact.Email,
                    Fax = regInsert.Contact.Fax,
                    IsDeleted = false,
                    TabsTypeId = regInsert.Contact.TabsTypeId,
                };
                regPat.RegPatientDetails.Add(contact);

                Core.Entities.RegPatientDetail employment = new Core.Entities.RegPatientDetail()
                {
                    Company = regInsert.Employment.company,
                    SectorOccupationId = regInsert.Employment.sector_occupationId,
                    EmploymentStatusId = regInsert.Employment.employmentsStatusId,
                    EmploymentTypeId = regInsert.Employment.employmentTypeId,
                    TabsTypeId = regInsert.Employment.TabsTypeId,

                };
                regPat.RegPatientDetails.Add(employment);

                Core.Entities.RegPatientDetail emergencycontact = new Core.Entities.RegPatientDetail()
                {
                    RelationshipId = regInsert.EmergencyContact.relationshipId,
                    FirstName = regInsert.EmergencyContact.firstName,
                    MiddleName = regInsert.EmergencyContact.middleName,
                    LastName = regInsert.EmergencyContact.lastName,
                    StreetName = regInsert.EmergencyContact.streetName,
                    DwellingNumber = regInsert.EmergencyContact.dwellingNumber,
                    CountryId = regInsert.EmergencyContact.countryId,
                    StateId = regInsert.EmergencyContact.stateId,
                    CityId = regInsert.EmergencyContact.cityId,
                    PostalCode = regInsert.EmergencyContact.postalCode,
                    CellPhone = regInsert.EmergencyContact.cellPhone.ToString(),
                    HomePhone = regInsert.EmergencyContact.homePhone.ToString(),
                    WorkPhone = regInsert.EmergencyContact.workPhone.ToString(),
                    TabsTypeId = regInsert.EmergencyContact.TabsTypeId,
                };
                regPat.RegPatientDetails.Add(emergencycontact);

                Core.Entities.RegPatientDetail nextOfKin = new Core.Entities.RegPatientDetail()
                {
                    RelationshipId = regInsert.NextOfKin.relationshipId,
                    FirstName = regInsert.NextOfKin.firstName,
                    MiddleName = regInsert.NextOfKin.middleName,
                    LastName = regInsert.NextOfKin.lastName,
                    StreetName = regInsert.NextOfKin.streetName,
                    DwellingNumber = regInsert.NextOfKin.NokdwellingNumber.ToString(),
                    CountryId = regInsert.NextOfKin.countryId,
                    StateId = regInsert.NextOfKin.stateId,
                    CityId = regInsert.NextOfKin.cityId,
                    PostalCode = regInsert.NextOfKin.postalCode.ToString(),
                    CellPhone = regInsert.NextOfKin.cellPhone.ToString(),
                    HomePhone = regInsert.NextOfKin.homePhone.ToString(),
                    WorkPhone = regInsert.NextOfKin.workPhone.ToString(),
                    TabsTypeId = regInsert.NextOfKin.TabsTypeId,
                };
                regPat.RegPatientDetails.Add(nextOfKin);

                Core.Entities.RegPatientDetail spouse = new Core.Entities.RegPatientDetail()
                {
                    FirstName = regInsert.Spouse.firstName,
                    MiddleName = regInsert.Spouse.middleName,
                    LastName = regInsert.Spouse.lastName,
                    GenderId = regInsert.Spouse.genderId,
                    TabsTypeId = regInsert.Spouse.TabsTypeId,

                };
                regPat.RegPatientDetails.Add(spouse);

                Core.Entities.RegPatientDetail parent = new Core.Entities.RegPatientDetail()
                {
                    FirstName = regInsert.Parent.firstName,
                    MiddleName = regInsert.Parent.middleName,
                    LastName = regInsert.Parent.lastName,
                    HomePhone = regInsert.Parent.homePhone.ToString(),
                    CellPhone = regInsert.Parent.cellPhone.ToString(),
                    Email = regInsert.Parent.email,
                    MotherFirstName = regInsert.Parent.motherFirstName,
                    MotherMiddleName = regInsert.Parent.mothermiddleName,
                    MotherLastName = regInsert.Parent.motherLastName,
                    MotherHomePhone = regInsert.Parent.motherHomePhone.ToString(),
                    MotherCellPhone = regInsert.Parent.motherCellPhone.ToString(),
                    MotherEmail = regInsert.Parent.motherEmail.ToString(),
                    TabsTypeId = regInsert.Parent.TabsTypeId,
                };
                regPat.RegPatientDetails.Add(parent);

                Core.Entities.RegPatientDetail assigment = new Core.Entities.RegPatientDetail()
                {
                    ProofOfIncome = regInsert.Assignments.proofOfIncome,
                    ProviderId = regInsert.Assignments.providerId,
                    FinancialClassId = regInsert.Assignments.financialClassId,
                    LocationId = regInsert.Assignments.locationId,
                    SiteId = regInsert.Assignments.siteId,
                    SignedDate = regInsert.Assignments.signedDate,
                    UnSignedDate = regInsert.Assignments.unsignedDate,
                    EntityTypeId = regInsert.Assignments.entityTypeId,
                    EntityNameId = regInsert.Assignments.entityNameId,
                    ReferredById = regInsert.Assignments.referredById,
                    TabsTypeId = regInsert.Assignments.TabsTypeId,
                };
                regPat.RegPatientDetails.Add(assigment);

                Core.Entities.RegPatientDetail familyMember = new Core.Entities.RegPatientDetail()
                {
                    MrNo = regInsert.FamilyMembers.mrNo.ToString(),
                    AccountTypeId = regInsert.FamilyMembers.accountTypeId,
                    MasterMrNo = regInsert.FamilyMembers.masterMrNo.ToString(),
                    RelationshipId = regInsert.FamilyMembers.relationshipId,
                    TabsTypeId = regInsert.FamilyMembers.TabsTypeId,
                };
                regPat.RegPatientDetails.Add(familyMember);

           
            //foreach (var item in regInsert.Employment)
            //{

            //    Core.Entities.RegPatientEmployer regPatientEmployer = new Core.Entities.RegPatientEmployer()
            //    {
            //        Mrno = getLastMRNO.LastMrno.ToString(),
            //        EmploymentTypeId = item.employmentTypeId,
            //        EmploymentStatusId = item.employmentsStatusId,
            //        EmploymentCompanyName = item.company,
            //        EmploymentOccupationId = (byte?)item.employmentsStatusId,
            //        IsDeleted = false,


            //    };
            //    regPat.RegPatientEmployers.Add(regPatientEmployer);
            //}
            //foreach (var item1 in regInsert.regAccount)
            //{
            //    Core.Entities.RegAccount regAccount = new Core.Entities.RegAccount()
            //    {
            //        Mrno = getLastMRNO.LastMrno.ToString(),
            //        TypeId = item1.TypeId,
            //        MasterAccountNo = item1.MasterAccountNo,
            //        AccountNo = getLastMRNO.LastMrno.ToString(),
            //        RelationshipId = item1.RelationshipId,
            //        IsDeleted = false,
            //    };
            //    regPat.RegAccounts.Add(regAccount);
            //}

            //foreach (var item2 in regInsert.regPatientDetails)
            //{
            //    Core.Entities.RegPatientDetail regPatientDetail = new Core.Entities.RegPatientDetail()
            //    {
            //        StreetName = item2.StreetName,
            //        DwellingNumber = item2.DwellingNumber,
            //        CountryId = item2.CountryId,
            //        StateId = item2.StateId,
            //        CityId = item2.CityId,
            //        PostalCode = item2.PostalCode,
            //        CellPhone = item2.CellPhone,
            //        HomePhone = item2.HomePhone,
            //        WorkPhone = item2.WorkPhone,
            //        Email = item2.Email,
            //        Fax = item2.Fax,
            //        IsDeleted = false,
            //        ERelationShipId = item2.RelationshipId,
            //        MotherFirstName = item2.pmotherFirstName,
            //        MotherMiddleName = item2.pmothermiddleName,
            //        MotherLastName = item2.pmotherLastName,
            //        MotherHomePhone = item2.pmotherHomePhone,
            //        MotherCellPhone = item2.pmotherCellPhone,
            //        MotherEmail = item2.pmotherEmail,
            //        ProofOfIncome  = item2.aproofOfIncome,
            //        ProviderId = item2.aproviderId,
            //        FeeScheduleId = item2.afeeScheduleId,
            //        FinancialClassId = item2.afinancialClassId,
            //        LocationId = item2.alocationId,
            //        SiteId = item2.asiteId,
            //        SignedDate = item2.asignedDate,
            //        UnSignedDate = item2.aunsignedDate,
            //        EntityTypeId = item2.aentityTypeId,
            //        EntityNameId = item2.aentityNameId,
            //        ReferredById = item2.areferredById,
            //        MrNo  =Convert.ToString(item2.fmrNo),
            //        MasterMrNo = Convert.ToString(item2.fmasterMrNo),
            //        RelationshipId = item2.frelationshipId,





            //    };
            //    regPat.RegPatientDetails.Add(regPatientDetail);
            //}
            ////Core.Entities.em regPatientDetail = new Core.Entities.RegPatientDetail()
            await _context.RegPatients.AddAsync(regPat);
                await _context.SaveChangesAsync();
                return true;

                //return false;
                //DataTable RegPatientEmployerDT = ConversionHelper.ToDataTable(regInsert.regPatientEmployer);

                //DataTable RegAccountDT = ConversionHelper.ToDataTable(regInsert.regAccount);

                //DataTable RegPatientDetailsDT = ConversionHelper.ToDataTable(regInsert.regPatientDetails);

                //RegInsert reg = new RegInsert();

                //reg = regInsert;

                //DynamicParameters parameters = new DynamicParameters();
                //parameters.Add("@PersonFirstName", reg.PersonFirstName);
                //parameters.Add("@PersonMiddleName", reg.PersonMiddleName);
                //parameters.Add("@PersonLastName", reg.PersonLastName);
                //parameters.Add("@PersonTitleId", reg.PersonTitleId);//mr1 mrs 0 
                //parameters.Add("@PersonSocialSecurityNo", reg.PersonSocialSecurityNo);//0
                //parameters.Add("@VIPPatient", reg.VIPPatient);
                //parameters.Add("@PersonSex", reg.PersonSexId);
                //parameters.Add("@PersonMaritalStatus", reg.PersonMaritalStatus);
                //parameters.Add("@PersonEthnicityTypeId", reg.PersonEthnicityTypeId);
                //parameters.Add("@PatientBirthDate", reg.PatientBirthDate);
                //parameters.Add("@PersonDriversLicenseNo", reg.PersonDriversLicenseNo);
                //parameters.Add("@PatientBloodGroupId", reg.PatientBloodGroupId);
                //parameters.Add("@PatientPicture", reg.PatientPicture);
                //parameters.Add("@ResidenceVisaNo", reg.ResidenceVisaNo);
                //parameters.Add("@LaborCardNo", reg.LaborCardNo);
                //parameters.Add("@Religion", reg.Religion);
                //parameters.Add("@PrimaryLanguage", reg.PrimaryLanguage);
                //parameters.Add("@Nationality", reg.Nationality);
                //parameters.Add("@EMPI", reg.EMPI);
                //parameters.Add("@MediaChannelId", reg.MediaChannelId);
                //parameters.Add("@MediaItemId", reg.MediaItemId);
                //parameters.Add("@EmiratesIDN", reg.EmiratesIDN);
                //parameters.Add("@PersonNameArabic", reg.PersonNameArabic);
                //parameters.Add("@TabsTypeId", reg.TabsTypeId);


                //parameters.Add("@RegPatientEmployerTypeVar", RegPatientEmployerDT, DbType.Object);

                //parameters.Add("@RegAccountTypeVar", RegAccountDT, DbType.Object);

                //parameters.Add("@RegDetailsTypeVar", RegPatientDetailsDT, DbType.Object);


                //bool res = await DapperHelper.ExcecuteSPByParams("REG_InsertDemographic", parameters);


                //return res;




            }
            catch (Exception ex)
            {
                return false;
            }

        }

        //public Task<bool> UpdateDemographicDB(RegInsert regUpdate)
        //{
        //    throw new NotImplementedException();
        //}

        //public Task<bool> InsertDemographicDB(RegInsert regInsert)
        //{
        //    throw new NotImplementedException();
        //}

        public async Task<DataSet> GetAllDemographicsData(FilterDemographicList req)
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
                param.Add("@PageSize", req.PaginationInfo.RowsPerPage, DbType.String);


                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("GetAllDemographicsData", param);
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
    }
}
