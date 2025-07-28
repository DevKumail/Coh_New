using HMIS.Data.Models;
using HMIS.Service.DTOs.Clinical;
using HMIS.Service.DTOs.Registration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HMIS.Service.Implementations
{
    public interface IAllDropdownsManager
    {
        Task<List<RegState>> GetStateByCountry(long? Id);
        Task<List<RegCity>> GetCityByState(long? Id);
        Task<List<FinancialClass>> GetFinancialClass();
        Task<List<FeeSchedule>> GetFeeSchedule();
        Task<List<EntityType>> GetEntityTypes();
        Task<List<EmirateType>> GetEmirateType();
        Task<List<RegLocationType>> GetSitebyfacility(long? Id);
        Task<List<CptbyAppType>> GetCPTGroupId();
        Task<List<BlEclaimEncounterType>> GetBlEclaimEncounterType();
        Task<List<BlEclaimEncounterStartType>> GetBlEclaimEncounterStartType();
        Task<List<BlEclaimEncounterEndType>> GetBlEclaimEncounterEndType();

        Task<List<Data.Models.RegGenderIdentity>> GetRegGenderIdentities();

//        Task<List<Data.Models.ImmunizationList>> GetImmunizationLists();

        Task<List<ImmunizationList>> GetImmunizationLists();

        Task<List<Emrsite>> GetEMRSite();

        Task<List<Emrroute>> GetEMRRoute();

        Task<List<AlergyType>> GetAlergyTypes();

        Task<List<SeverityType>> GetSeverityType();

        Task<List<SocialFamilyHistoryMaster>> GetSocialHistory();

        Task<List<FamilyProblemList>> GetFamilyProblemHistory();

        Task<List<MedicationComment>> GetComments();

        Task<List<Emrfrequency>> GetFrequency();
        Task<List<PatientProcedureType>> GetPatientProcedureTypeList();

        Task<List<RegAlertType>> GetAlertType();
    }
}
