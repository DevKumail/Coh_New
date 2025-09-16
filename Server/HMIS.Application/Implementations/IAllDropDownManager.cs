using HMIS.Core.Entities;
using HMIS.Application.DTOs.Clinical;
using HMIS.Application.DTOs.Registration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.ApplicationImplementations
{
    public interface IAllDropdownsManager
    {
        Task<List<RegStates>> GetStateByCountry(long? Id);
        Task<List<RegCities>> GetCityByState(long? Id);
        Task<List<FinancialClass>> GetFinancialClass();
        Task<List<FeeSchedule>> GetFeeSchedule();
        Task<List<EntityTypes>> GetEntityTypes();
        Task<List<EmirateType>> GetEmirateType();
        Task<List<RegLocationTypes>> GetSitebyfacility(long? Id);
        Task<List<CptbyAppType>> GetCPTGroupId();
        Task<List<BlEclaimEncounterType>> GetBlEclaimEncounterType();
        Task<List<BlEclaimEncounterStartType>> GetBlEclaimEncounterStartType();
        Task<List<BlEclaimEncounterEndType>> GetBlEclaimEncounterEndType();

        Task<List<Core.Entities.RegGenderIdentity>> GetRegGenderIdentities();

//        Task<List<Core.Entities.ImmunizationList>> GetImmunizationLists();

        Task<List<ImmunizationList>> GetImmunizationLists();

        Task<List<Emrsite>> GetEMRSite();

        Task<List<Emrroute>> GetEMRRoute();

        Task<List<AlergyTypes>> GetAlergyTypes();

        Task<List<SeverityType>> GetSeverityType();

        Task<List<SocialFamilyHistoryMaster>> GetSocialHistory();

        Task<List<FamilyProblemList>> GetFamilyProblemHistory();

        Task<List<MedicationComments>> GetComments();

        Task<List<Emrfrequency>> GetFrequency();
        Task<List<PatientProcedureType>> GetPatientProcedureTypeList();

        Task<List<RegAlertTypes>> GetAlertType();
    }
}
