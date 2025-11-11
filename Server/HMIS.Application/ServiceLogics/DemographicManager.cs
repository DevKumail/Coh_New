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
            var findResult = await Task.Run(() => _context.RegPatient.Include(x => x.RegPatientEmployer).Include(x => x.RegAccount).Include(x => x.RegPatientDetails).Where(x => x.PatientId.Equals(PatientId) && x.IsDeleted == false).FirstOrDefaultAsync());
            if (findResult != null)
            {
                findResult.IsDeleted = true;
                foreach (var item in findResult.RegPatientEmployer)
                {
                    item.IsDeleted = true;
                    //findResult.RegPatientEmployers.Add(item);
                }
                foreach (var item1 in findResult.RegAccount)
                {
                    item1.IsDeleted = false;
                    //findResult.RegAccounts.Add(item1);
                }
                foreach (var item2 in findResult.RegPatientDetails)
                {
                    item2.IsDeleted = false;
                    //findResult.RegPatientDetails.Add(item2);
                }
                _context.RegPatient.Update(findResult);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> UpdateDemographicDB(RegInsert regUpdate)
        {
            try

            {
                var findResult = await Task.Run(() => _context.RegPatient.Include(x=>x.RegPatientEmployer).Include(x=>x.RegAccount).Include(x=>x.RegPatientDetails).Where(x => x.PatientId.Equals(regUpdate.PatientId) && x.IsDeleted == false).FirstOrDefaultAsync());

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
                        findResult.RegPatientEmployer.Add(regPatientEmployer);
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
                        findResult.RegAccount.Add(regAccount);
                    }

                    // 🔹 Contact
                    var existingContact = findResult.RegPatientDetails
                        .FirstOrDefault(x => x.TabsTypeId == regUpdate.Contact.TabsTypeId && x.IsDeleted == false);

                    if (existingContact != null)
                    {
                        // Update existing contact
                        existingContact.StreetName = regUpdate.Contact.StreetName;
                        existingContact.DwellingNumber = regUpdate.Contact.DwellingNumber;
                        existingContact.CountryId = regUpdate.Contact.CountryId;
                        existingContact.StateId = regUpdate.Contact.StateId;
                        existingContact.CityId = regUpdate.Contact.CityId;
                        existingContact.PostalCode = regUpdate.Contact.PostalCode;
                        existingContact.CellPhone = regUpdate.Contact.CellPhone;
                        existingContact.HomePhone = regUpdate.Contact.HomePhone;
                        existingContact.WorkPhone = regUpdate.Contact.WorkPhone;
                        existingContact.Email = regUpdate.Contact.Email;
                        existingContact.Fax = regUpdate.Contact.Fax;
                    }
                    else
                    {
                        // Insert new if not exist
                        Core.Entities.RegPatientDetails contact = new Core.Entities.RegPatientDetails()
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
                            TabsTypeId = regUpdate.Contact.TabsTypeId,
                            IsDeleted = false
                        };
                        findResult.RegPatientDetails.Add(contact);
                    }


                    //Core.Entities.RegPatientDetails employment = new Core.Entities.RegPatientDetails()
                    //Core.Entities.RegPatientDetails employment = new Core.Entities.RegPatientDetails();
                    //if(regUpdate.Employment != null)
                    //{
                    //    employment.Company = regUpdate.Employment.company;
                    //    employment.SectorOccupationId = regUpdate.Employment.sector_occupationId;
                    //    employment.EmploymentStatusId = regUpdate.Employment.employmentsStatusId;
                    //    employment.EmploymentTypeId = regUpdate.Employment.employmentTypeId;
                    //    employment.TabsTypeId = regUpdate.Employment.TabsTypeId;

                    //findResult.RegPatientDetails.Add(employment);
                    //};

                    // ✅ EMPLOYMENT
                    if (regUpdate.Employment != null)
                    {
                        var existingEmployment = findResult.RegPatientDetails
                            .FirstOrDefault(x => x.TabsTypeId == regUpdate.Employment.TabsTypeId);

                        if (existingEmployment != null)
                        {
                            // Update existing
                            existingEmployment.Company = regUpdate.Employment.company;
                            existingEmployment.SectorOccupationId = regUpdate.Employment.sector_occupationId;
                            existingEmployment.EmploymentStatusId = regUpdate.Employment.employmentsStatusId;
                            existingEmployment.EmploymentTypeId = regUpdate.Employment.employmentTypeId;
                        }
                        else
                        {
                            // Insert new
                            var employment = new Core.Entities.RegPatientDetails
                            {
                                Company = regUpdate.Employment.company,
                                SectorOccupationId = regUpdate.Employment.sector_occupationId,
                                EmploymentStatusId = regUpdate.Employment.employmentsStatusId,
                                EmploymentTypeId = regUpdate.Employment.employmentTypeId,
                                TabsTypeId = regUpdate.Employment.TabsTypeId
                            };
                            findResult.RegPatientDetails.Add(employment);
                        }
                    }


                    // ------------------- Emergency Contact -------------------
                    if (regUpdate.EmergencyContact != null)
                    {
                        var existingEmergency = findResult.RegPatientDetails
                            .FirstOrDefault(x => x.TabsTypeId == regUpdate.EmergencyContact.TabsTypeId);

                        if (existingEmergency != null)
                        {
                            // Update existing
                            existingEmergency.RelationshipId = regUpdate.EmergencyContact.relationshipId;
                            existingEmergency.FirstName = regUpdate.EmergencyContact.firstName;
                            existingEmergency.MiddleName = regUpdate.EmergencyContact.middleName;
                            existingEmergency.LastName = regUpdate.EmergencyContact.lastName;
                            existingEmergency.StreetName = regUpdate.EmergencyContact.streetName;
                            existingEmergency.CountryId = regUpdate.EmergencyContact.countryId;
                            existingEmergency.StateId = regUpdate.EmergencyContact.stateId;
                            existingEmergency.CityId = regUpdate.EmergencyContact.cityId;
                            existingEmergency.PostalCode = regUpdate.EmergencyContact.postalCode;
                            existingEmergency.CellPhone = regUpdate.EmergencyContact.cellPhone.ToString();
                            existingEmergency.HomePhone = regUpdate.EmergencyContact.homePhone.ToString();
                            existingEmergency.WorkPhone = regUpdate.EmergencyContact.workPhone.ToString();
                            existingEmergency.Email = regUpdate.EmergencyContact.email;
                        }
                        else
                        {
                            // Insert new
                            var emergency = new Core.Entities.RegPatientDetails
                            {
                                RelationshipId = regUpdate.EmergencyContact.relationshipId,
                                FirstName = regUpdate.EmergencyContact.firstName,
                                MiddleName = regUpdate.EmergencyContact.middleName,
                                LastName = regUpdate.EmergencyContact.lastName,
                                StreetName = regUpdate.EmergencyContact.streetName,
                                CountryId = regUpdate.EmergencyContact.countryId,
                                StateId = regUpdate.EmergencyContact.stateId,
                                CityId = regUpdate.EmergencyContact.cityId,
                                PostalCode = regUpdate.EmergencyContact.postalCode,
                                CellPhone = regUpdate.EmergencyContact.cellPhone.ToString(),
                                HomePhone = regUpdate.EmergencyContact.homePhone.ToString(),
                                WorkPhone = regUpdate.EmergencyContact.workPhone.ToString(),
                                Email = regUpdate.EmergencyContact.email,
                                TabsTypeId = regUpdate.EmergencyContact.TabsTypeId
                            };
                            findResult.RegPatientDetails.Add(emergency);
                        }
                    };




                    // ------------------- Next Of Kin -------------------
                    if (regUpdate.NextOfKin != null)
                    {
                        var existingNextOfKin = findResult.RegPatientDetails
                            .FirstOrDefault(x => x.TabsTypeId == regUpdate.NextOfKin.TabsTypeId);

                        if (existingNextOfKin != null)
                        {
                            // Update existing
                            existingNextOfKin.RelationshipId = regUpdate.NextOfKin.relationshipId;
                            existingNextOfKin.FirstName = regUpdate.NextOfKin.firstName;
                            existingNextOfKin.MiddleName = regUpdate.NextOfKin.middleName;
                            existingNextOfKin.LastName = regUpdate.NextOfKin.lastName;
                            existingNextOfKin.StreetName = regUpdate.NextOfKin.streetName;
                            existingNextOfKin.Email = regUpdate.NextOfKin.email;
                            existingNextOfKin.CountryId = regUpdate.NextOfKin.countryId;
                            existingNextOfKin.StateId = regUpdate.NextOfKin.stateId;
                            existingNextOfKin.CityId = regUpdate.NextOfKin.cityId;
                            existingNextOfKin.PostalCode = regUpdate.NextOfKin.postalCode.ToString();
                            existingNextOfKin.CellPhone = regUpdate.NextOfKin.cellPhone.ToString();
                            existingNextOfKin.HomePhone = regUpdate.NextOfKin.homePhone.ToString();
                            existingNextOfKin.WorkPhone = regUpdate.NextOfKin.workPhone.ToString();
                        }
                        else
                        {
                            // Insert new
                            var nextOfKin = new Core.Entities.RegPatientDetails
                            {
                                RelationshipId = regUpdate.NextOfKin.relationshipId,
                                FirstName = regUpdate.NextOfKin.firstName,
                                MiddleName = regUpdate.NextOfKin.middleName,
                                LastName = regUpdate.NextOfKin.lastName,
                                StreetName = regUpdate.NextOfKin.streetName,
                                Email = regUpdate.NextOfKin.email,
                                CountryId = regUpdate.NextOfKin.countryId,
                                StateId = regUpdate.NextOfKin.stateId,
                                CityId = regUpdate.NextOfKin.cityId,
                                PostalCode = regUpdate.NextOfKin.postalCode.ToString(),
                                CellPhone = regUpdate.NextOfKin.cellPhone.ToString(),
                                HomePhone = regUpdate.NextOfKin.homePhone.ToString(),
                                WorkPhone = regUpdate.NextOfKin.workPhone.ToString(),
                                TabsTypeId = regUpdate.NextOfKin.TabsTypeId
                            };
                            findResult.RegPatientDetails.Add(nextOfKin);
                        }
                    }



                    // ------------------- Spouse -------------------
                    if (regUpdate.Spouse != null)
                    {
                        var existingSpouse = findResult.RegPatientDetails
                            .FirstOrDefault(x => x.TabsTypeId == regUpdate.Spouse.TabsTypeId);

                        if (existingSpouse != null)
                        {
                            existingSpouse.FirstName = regUpdate.Spouse.firstName;
                            existingSpouse.MiddleName = regUpdate.Spouse.middleName;
                            existingSpouse.LastName = regUpdate.Spouse.lastName;
                            existingSpouse.GenderId = regUpdate.Spouse.genderId;
                        }
                        else
                        {
                            var spouse = new Core.Entities.RegPatientDetails
                            {
                                FirstName = regUpdate.Spouse.firstName,
                                MiddleName = regUpdate.Spouse.middleName,
                                LastName = regUpdate.Spouse.lastName,
                                GenderId = regUpdate.Spouse.genderId,
                                TabsTypeId = regUpdate.Spouse.TabsTypeId
                            };
                            findResult.RegPatientDetails.Add(spouse);
                        }
                    }



                    // ------------------- Parent -------------------
                    if (regUpdate.Parent != null)
                    {
                        var existingParent = findResult.RegPatientDetails
                            .FirstOrDefault(x => x.TabsTypeId == regUpdate.Parent.TabsTypeId);

                        if (existingParent != null)
                        {
                            existingParent.FirstName = regUpdate.Parent.firstName;
                            existingParent.MiddleName = regUpdate.Parent.middleName;
                            existingParent.LastName = regUpdate.Parent.lastName;
                            existingParent.HomePhone = regUpdate.Parent.homePhone.ToString();
                            existingParent.CellPhone = regUpdate.Parent.cellPhone.ToString();
                            existingParent.Email = regUpdate.Parent.email;
                            existingParent.MotherFirstName = regUpdate.Parent.motherFirstName;
                            existingParent.MotherMiddleName = regUpdate.Parent.mothermiddleName;
                            existingParent.MotherLastName = regUpdate.Parent.motherLastName;
                            existingParent.MotherHomePhone = regUpdate.Parent.motherHomePhone.ToString();
                            existingParent.MotherCellPhone = regUpdate.Parent.motherCellPhone.ToString();
                            existingParent.MotherEmail = regUpdate.Parent.motherEmail.ToString();
                        }
                        else
                        {
                            var parent = new Core.Entities.RegPatientDetails
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
                                TabsTypeId = regUpdate.Parent.TabsTypeId
                            };
                            findResult.RegPatientDetails.Add(parent);
                        }
                    }



                    // ------------------- Assignment -------------------
                    if (regUpdate.Assignments != null)
                    {
                        var existingAssignment = findResult.RegPatientDetails
                            .FirstOrDefault(x => x.TabsTypeId == regUpdate.Assignments.TabsTypeId);

                        if (existingAssignment != null)
                        {
                            existingAssignment.ProofOfIncome = regUpdate.Assignments.proofOfIncome;
                            existingAssignment.ProviderId = regUpdate.Assignments.providerId;
                            existingAssignment.FinancialClassId = regUpdate.Assignments.financialClassId;
                            existingAssignment.LocationId = regUpdate.Assignments.locationId;
                            existingAssignment.SiteId = regUpdate.Assignments.siteId;
                            existingAssignment.SignedDate = regUpdate.Assignments.signedDate;
                            existingAssignment.UnSignedDate = regUpdate.Assignments.unsignedDate;
                            existingAssignment.EntityTypeId = regUpdate.Assignments.entityTypeId;
                            existingAssignment.EntityNameId = regUpdate.Assignments.entityNameId;
                            existingAssignment.ReferredById = regUpdate.Assignments.referredById;
                        }
                        else
                        {
                            var assignment = new Core.Entities.RegPatientDetails
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
                                TabsTypeId = regUpdate.Assignments.TabsTypeId
                            };
                            findResult.RegPatientDetails.Add(assignment);
                        }
                    }

                    // ------------------- Family Member -------------------
                    if (regUpdate.FamilyMembers != null)
                    {
                        var existingFamily = findResult.RegPatientDetails
                            .FirstOrDefault(x => x.TabsTypeId == regUpdate.FamilyMembers.TabsTypeId);

                        if (existingFamily != null)
                        {
                            existingFamily.MrNo = regUpdate.FamilyMembers.mrNo.ToString();
                            existingFamily.AccountTypeId = regUpdate.FamilyMembers.accountTypeId;
                            existingFamily.MasterMrNo = regUpdate.FamilyMembers.masterMrNo.ToString();
                            existingFamily.RelationshipId = regUpdate.FamilyMembers.relationshipId;
                        }
                        else
                        {
                            var family = new Core.Entities.RegPatientDetails
                            {
                                MrNo = regUpdate.FamilyMembers.mrNo.ToString(),
                                AccountTypeId = regUpdate.FamilyMembers.accountTypeId,
                                MasterMrNo = regUpdate.FamilyMembers.masterMrNo.ToString(),
                                RelationshipId = regUpdate.FamilyMembers.relationshipId,
                                TabsTypeId = regUpdate.FamilyMembers.TabsTypeId
                            };
                            findResult.RegPatientDetails.Add(family);
                        }
                    }

                }
                ;
                _context.RegPatient.Update(findResult);

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
                param.Add("@PatientId", Convert.ToInt64(PatientId), DbType.Int64);

                DataSet ds = await DapperHelper.GetDataSetBySPWithParams("REG_GetDemographicById", param);

                if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new DataSet();
                }

                return ds;
            }
            catch (Exception ex)
            {
                // Optional: log exception if needed
                return new DataSet();
            }
        }


        public async Task<dynamic> InsertDemographicDB(RegInsert regInsert)
        {
            try
            {

                string newMrno = "0";
                var getLastMRNO = new RegLastMrno();
                if (regInsert != null && regInsert.PatientId == 0)
                {
                    getLastMRNO = await Task.Run(() => _context.RegLastMrno.FirstOrDefaultAsync());
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


                Core.Entities.RegPatientDetails contact = new Core.Entities.RegPatientDetails()
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

                Core.Entities.RegPatientDetails employment = new Core.Entities.RegPatientDetails();

                if (regInsert.Employment != null)
                {
                employment.Company = regInsert.Employment.company;
                employment.SectorOccupationId = regInsert.Employment.sector_occupationId;
                employment.EmploymentStatusId = regInsert.Employment.employmentsStatusId;
                employment.EmploymentTypeId = regInsert.Employment.employmentTypeId;
                employment.TabsTypeId = regInsert.Employment.TabsTypeId;
                regPat.RegPatientDetails.Add(employment);
                }


                Core.Entities.RegPatientDetails emergencycontact = new Core.Entities.RegPatientDetails();
                if (regInsert.EmergencyContact != null) 
                { 
                emergencycontact.RelationshipId = regInsert.EmergencyContact.relationshipId;
                emergencycontact.FirstName = regInsert.EmergencyContact.firstName;
                emergencycontact.MiddleName = regInsert.EmergencyContact.middleName;
                emergencycontact.LastName = regInsert.EmergencyContact.lastName;
                emergencycontact.StreetName = regInsert.EmergencyContact.streetName;
                emergencycontact.CountryId = regInsert.EmergencyContact.countryId;
                emergencycontact.StateId = regInsert.EmergencyContact.stateId;
                emergencycontact.CityId = regInsert.EmergencyContact.cityId;
                emergencycontact.PostalCode = regInsert.EmergencyContact.postalCode;
                emergencycontact.CellPhone = regInsert.EmergencyContact.cellPhone.ToString();
                emergencycontact.HomePhone = regInsert.EmergencyContact.homePhone.ToString();
                emergencycontact.WorkPhone = regInsert.EmergencyContact.workPhone.ToString();
                emergencycontact.Email = regInsert.EmergencyContact.email;
                emergencycontact.TabsTypeId = regInsert.EmergencyContact.TabsTypeId;
                regPat.RegPatientDetails.Add(emergencycontact);
                }

                Core.Entities.RegPatientDetails nextOfKin = new Core.Entities.RegPatientDetails();
                 if(regInsert.NextOfKin != null)
                {
                    nextOfKin.RelationshipId = regInsert.NextOfKin.relationshipId;
                    nextOfKin.FirstName = regInsert.NextOfKin.firstName;
                    nextOfKin.MiddleName = regInsert.NextOfKin.middleName;
                    nextOfKin.LastName = regInsert.NextOfKin.lastName;
                    nextOfKin.StreetName = regInsert.NextOfKin.streetName;
                    nextOfKin.CountryId = regInsert.NextOfKin.countryId;
                    nextOfKin.StateId = regInsert.NextOfKin.stateId;
                    nextOfKin.CityId = regInsert.NextOfKin.cityId;
                    nextOfKin.PostalCode = regInsert.NextOfKin.postalCode.ToString();
                    nextOfKin.CellPhone = regInsert.NextOfKin.cellPhone.ToString();
                    nextOfKin.HomePhone = regInsert.NextOfKin.homePhone.ToString();
                    emergencycontact.Email = regInsert.EmergencyContact.email;
                    nextOfKin.WorkPhone = regInsert.NextOfKin.workPhone.ToString();
                    nextOfKin.TabsTypeId = regInsert.NextOfKin.TabsTypeId;
                    regPat.RegPatientDetails.Add(nextOfKin);
                };

                Core.Entities.RegPatientDetails spouse = new Core.Entities.RegPatientDetails();
                if(regInsert.Spouse != null) 
                {
                    spouse.FirstName = regInsert.Spouse.firstName;
                    spouse.MiddleName = regInsert.Spouse.middleName;
                    spouse.LastName = regInsert.Spouse.lastName;
                    spouse.GenderId = regInsert.Spouse.genderId;
                    spouse.TabsTypeId = regInsert.Spouse.TabsTypeId;
                    regPat.RegPatientDetails.Add(spouse);
                };

                Core.Entities.RegPatientDetails parent = new Core.Entities.RegPatientDetails();
                if(regInsert.Parent != null) 
                {
                    parent.FirstName = regInsert.Parent.firstName;
                    parent.MiddleName = regInsert.Parent.middleName;
                    parent.LastName = regInsert.Parent.lastName;
                    parent.HomePhone = regInsert.Parent.homePhone.ToString();
                    parent.CellPhone = regInsert.Parent.cellPhone.ToString();
                    parent.Email = regInsert.Parent.email;
                    parent.MotherFirstName = regInsert.Parent.motherFirstName;
                    parent.MotherMiddleName = regInsert.Parent.mothermiddleName;
                    parent.MotherLastName = regInsert.Parent.motherLastName;
                    parent.MotherHomePhone = regInsert.Parent.motherHomePhone.ToString();
                    parent.MotherCellPhone = regInsert.Parent.motherCellPhone.ToString();
                    parent.MotherEmail = regInsert.Parent.motherEmail.ToString();
                    parent.TabsTypeId = regInsert.Parent.TabsTypeId;
                    regPat.RegPatientDetails.Add(parent);
                };

                Core.Entities.RegPatientDetails assigment = new Core.Entities.RegPatientDetails();
                if(regInsert.Assignments != null)
                {
                    assigment.ProofOfIncome = regInsert.Assignments.proofOfIncome;
                    assigment.ProviderId = regInsert.Assignments.providerId;
                    assigment.FinancialClassId = regInsert.Assignments.financialClassId;
                    assigment.LocationId = regInsert.Assignments.locationId;
                    assigment.SiteId = regInsert.Assignments.siteId;
                    assigment.SignedDate = regInsert.Assignments.signedDate;
                    assigment.UnSignedDate = regInsert.Assignments.unsignedDate;
                    assigment.EntityTypeId = regInsert.Assignments.entityTypeId;
                    assigment.EntityNameId = regInsert.Assignments.entityNameId;
                    assigment.ReferredById = regInsert.Assignments.referredById;
                    assigment.TabsTypeId = regInsert.Assignments.TabsTypeId;
                    regPat.RegPatientDetails.Add(assigment);
                };

                Core.Entities.RegPatientDetails familyMember = new Core.Entities.RegPatientDetails();
                if(regInsert.FamilyMembers != null)
                {
                    familyMember.MrNo = regInsert.FamilyMembers.mrNo.ToString();
                    familyMember.AccountTypeId = regInsert.FamilyMembers.accountTypeId;
                    familyMember.MasterMrNo = regInsert.FamilyMembers.masterMrNo.ToString();
                    familyMember.RelationshipId = regInsert.FamilyMembers.relationshipId;
                    familyMember.TabsTypeId = regInsert.FamilyMembers.TabsTypeId;
                    regPat.RegPatientDetails.Add(familyMember);
                };

           
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
            await _context.RegPatient.AddAsync(regPat);
                await _context.SaveChangesAsync();
                return "insert successfully";

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
                return ex.Message;
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
